import useLang from "@/context/useLang";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import request from "../utils/request";
import useAuthMiddleware from "@/context/useAuthMiddleware";

interface Interface__Req {
  config: AxiosRequestConfig;
  onResolve?: {
    onSuccess?: (r: AxiosResponse<any, any>) => void;
    onError?: (r: any) => void;
  };
}

interface Props {
  id: string;
  showLoadingToast?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: {
    title?: string;
    description?: string;
  };
  successMessage?: {
    title?: string;
    description?: string;
  };
  errorMessage?: Record<
    number,
    Record<string, { title: string; description: string }> & {
      default?: { title: string; description: string };
    }
  >;
  dataResource?: boolean;

  loginPath?: string;
}
const useRequest = (props: Props) => {
  // Props
  const {
    id,
    showLoadingToast = true,
    showSuccessToast = true,
    showErrorToast = true,
    loadingMessage,
    successMessage,
    errorMessage,
    loginPath = "/",
  } = props;

  //  Hooks
  const { l } = useLang();
  const navigate = useNavigate();

  // Contexts
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [response, setResponse] = useState<any>(undefined);
  const [error, setError] = useState<boolean>(false);
  const fLoadingMessage = {
    title: loadingMessage?.title || l.default_request_loading_toast.title,
    description:
      loadingMessage?.description ||
      l.default_request_loading_toast.description,
  };
  const fSuccessMessage = {
    title: successMessage?.title || l.default_request_success_toast.title,
    description:
      successMessage?.description ||
      l.default_request_success_toast.description,
  };

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  // Make request func
  function req({ config, onResolve }: Interface__Req) {
    showLoadingToast &&
      toaster.loading({
        id: id,
        title: fLoadingMessage.title,
        description: fLoadingMessage.description,
      });

    if (!loading) setLoading(true);
    if (error) setError(false);
    if (status) setStatus(undefined);

    // Add api base url
    config.url = `${import.meta.env.VITE_API_BASE_URL}${config.url}`;

    // Abort request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Start request
    request(config)
      .then((r) => {
        setStatus(r.status);
        if (r.status === 200 || r.status === 201) {
          setResponse(r);
          setLoading(false);
          if (onResolve?.onSuccess) {
            onResolve.onSuccess(r);
          }
        }

        showSuccessToast &&
          showLoadingToast &&
          toaster.update(id, {
            type: "success",
            title: fSuccessMessage.title,
            description: fSuccessMessage.description,
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
      })
      .catch((e) => {
        switch (e.code) {
          default:
            console.log(e);
            setError(true);
            break;
          case "ERR_CANCELED":
            setLoading(false);
            break;
        }

        switch (e.status) {
          case 401:
          case 403:
            // call logout func
            localStorage.removeItem("__auth_token");
            setAuthToken(undefined);
            navigate(loginPath);
            break;
          case 500:
            // navigate("/server-error");
            break;
          case 503:
            navigate("/maintenance");
            break;
        }

        const errorToast = () => {
          const statusCode = e.status;
          const errorCase = e.response?.data?.case;

          if (errorMessage?.[statusCode]) {
            if (errorCase && errorMessage[statusCode][errorCase]) {
              return errorMessage[statusCode][errorCase];
            }
            return (
              errorMessage[statusCode].default || {
                title: l.error_default_toast.title,
                description: l.error_default_toast.description,
              }
            );
          } else if (e.code === "ERR_NETWORK") {
            return l.error_network_toast;
          } else if (statusCode === 400) {
            switch (errorCase) {
              default:
                return {
                  title: l.error_400_toast.title,
                  description: l.error_400_toast.description,
                };
              case "FAILED_VALIDATION":
                return {
                  title: l.error_400_toast.title,
                  description: l.error_400_toast.description,
                };
              case "STEP_NOT_ALLOWED":
                return {
                  title: l.error_403_toast.title,
                  description: l.error_403_toast.description,
                };
            }
          } else if (statusCode === 401) {
            return {
              title: l.error_401_toast.title,
              description: l.error_401_toast.description,
            };
          } else if (statusCode === 403) {
            return {
              title: l.error_403_toast.title,
              description: l.error_403_toast.description,
            };
          } else if (statusCode === 404) {
            switch (errorCase) {
              default:
                return {
                  title: l.error_404_toast.title,
                  description: l.error_404_toast.description,
                };
              case "SHAPEFILES_NOT_FOUND":
                return {
                  title: l.missing_layer_data_toast.title,
                  description: l.missing_layer_data_toast.description,
                };
            }
          } else if (statusCode === 409) {
            switch (errorCase) {
              default:
                return {
                  title: l.error_409_toast.title,
                  description: l.error_409_toast.description,
                };
              case "DUPLICATE_NAME":
                return {
                  title: l.error_duplicate_name_toast.title,
                  description: l.error_duplicate_name_toast.description,
                };
              case "DUPLICATE_EMAIL":
                return {
                  title: l.error_duplicate_email_toast.title,
                  description: l.error_duplicate_email_toast.description,
                };
            }
          } else if (statusCode === 500) {
            return {
              title: l.error_500_toast.title,
              description: l.error_500_toast.description,
            };
          }

          // Default error
          return {
            title: l.default_request_error_toast.title,
            description: l.default_request_error_toast.description,
          };
        };

        showErrorToast &&
          showLoadingToast &&
          toaster.update(id, {
            type: "error",
            ...errorToast(),
            action: {
              label: "Close",
              onClick: () => {},
            },
          });

        showErrorToast &&
          !showLoadingToast &&
          toaster.error({
            ...errorToast(),
            action: {
              label: "Close",
              onClick: () => {},
            },
          });

        onResolve?.onError?.(e);

        setStatus(e.response?.status);
        setResponse(e.response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return {
    req,
    loading,
    setLoading,
    status,
    setStatus,
    response,
    setResponse,
    error,
    setError,
  };
};

export default useRequest;
