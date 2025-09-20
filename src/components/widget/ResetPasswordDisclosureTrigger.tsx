import CContainer from "@/components/ui-custom/CContainer";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import { maskEmail } from "@/utils/maskEmail";
import {
  PinInputControl,
  PinInputHiddenInput,
  PinInputInput,
  PinInputRoot,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import BackButton from "../ui-custom/BackButton";
import BButton from "../ui-custom/BButton";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import HelperText from "../ui-custom/HelperText";
import PasswordInput from "../ui-custom/PasswordInput";
import StringInput from "../ui-custom/StringInput";
import { Field } from "../ui/field";

const Step1 = (props: any) => {
  // Props
  const { setStep, setEmail } = props;

  // Hooks
  const { l } = useLang();
  const { req, loading } = useRequest({
    id: "forgot_password",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(l.required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      const url = `/api/send-otp`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setStep(2);
            setEmail(values.email);
          },
        },
      });
    },
  });

  return (
    <>
      <DisclosureBody>
        <CContainer>
          <form>
            <Field
              label="Email"
              invalid={!!formik.errors.email}
              errorText={formik.errors.email as string}
              mb={4}
            >
              <StringInput
                name="email"
                onChangeSetter={(input) => {
                  formik.setFieldValue("email", input);
                }}
                inputValue={formik.values.email}
                placeholder="example@email.com"
              />
            </Field>
          </form>

          <HelperText>{l.forgot_password_step_1_helper}</HelperText>
        </CContainer>
      </DisclosureBody>

      <DisclosureFooter>
        <BackButton />

        <BButton
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
        >
          {l.recieve} OTP
        </BButton>
      </DisclosureFooter>
    </>
  );
};
const Step2 = (props: any) => {
  // Props
  const { email, setOtp, setStep } = props;

  // Hooks
  const { l } = useLang();
  const { req, loading } = useRequest({
    id: "forgot_password",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: { email: email, otp: "" },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(l.required_form),
      otp: yup.string().email().required(l.required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      const url = `/api/verify-otp`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setOtp(values.otp);
            setStep(3);
          },
        },
      });
    },
  });

  return (
    <>
      <DisclosureBody>
        <CContainer>
          <form>
            <Field
              label="OTP"
              invalid={!!formik.errors.otp}
              errorText={formik.errors.otp as string}
              mb={4}
            >
              <PinInputRoot
                colorPalette={themeConfig.colorPalette}
                w={"full"}
                size={"xl"}
                onValueChange={(e) => {
                  formik?.setFieldValue("otp", e.value);
                }}
              >
                <PinInputHiddenInput />
                <PinInputControl w={"full"}>
                  {Array.from({ length: 6 }, (_, i) => {
                    return (
                      <PinInputInput
                        key={i}
                        index={i}
                        flex={1}
                        h={"60px"}
                        fontSize={"xl"}
                        fontWeight={"bold"}
                      />
                    );
                  })}
                </PinInputControl>
              </PinInputRoot>
            </Field>
          </form>

          <HelperText color={"fg.subtle"}>{`${l.otp_sent_to} ${maskEmail(
            email
          )}`}</HelperText>
          <HelperText>{l.forgot_password_step_2_helper}</HelperText>
        </CContainer>
      </DisclosureBody>

      <DisclosureFooter>
        <BackButton />

        <BButton
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
        >
          {l.verify} OTP
        </BButton>
      </DisclosureFooter>
    </>
  );
};
const Step3 = (props: any) => {
  // Props
  const { email, otp } = props;

  // Hooks
  const { l } = useLang();
  const { req, loading } = useRequest({
    id: "forgot_password",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      email: email,
      otp: otp,
      password: "",
      password_confirmation: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(l.required_form),
      otp: yup.string().required(l.required_form),
      password: yup.string().required(l.required_form),
      password_confirmation: yup
        .string()
        .required(l.required_form)
        .oneOf([yup.ref("password"), ""], l.password_confirmation_not_match),
    }),
    onSubmit: (values) => {
      // console.log(values);

      const payload = new FormData();
      payload.append("email", values.email);
      payload.append("otp", values.otp);
      payload.append("password", values.password);
      payload.append("password_confirmation", values.password_confirmation);
      const url = `/api/reset-password`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            back();
          },
        },
      });
    },
  });

  return (
    <>
      <DisclosureBody>
        <CContainer>
          <form>
            <Field
              label={"Password"}
              invalid={!!formik.errors.password}
              errorText={formik.errors.password as string}
              mb={4}
            >
              <PasswordInput
                onChangeSetter={(input) => {
                  formik.setFieldValue("password", input);
                }}
                inputValue={formik.values.password}
              />
            </Field>

            <Field
              label={l.password_confirmation}
              invalid={!!formik.errors.password_confirmation}
              errorText={formik.errors.password_confirmation as string}
              mb={4}
            >
              <PasswordInput
                onChangeSetter={(input) => {
                  formik.setFieldValue("password_confirmation", input);
                }}
                inputValue={formik.values.password_confirmation}
              />
            </Field>
          </form>

          <HelperText>{l.forgot_password_step_3_helper}</HelperText>
        </CContainer>
      </DisclosureBody>

      <DisclosureFooter>
        <BackButton />

        <BButton
          colorPalette={themeConfig.colorPalette}
          onClick={formik.submitForm}
          loading={loading}
          disabled={
            !(formik.values.password && formik.values.password_confirmation)
          }
        >
          {l.save}
        </BButton>
      </DisclosureFooter>
    </>
  );
};

const ResetPasswordDisclosureTrigger = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`forgot-password`, open, onOpen, onClose);

  // States
  const [otp, setOtp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const STEP_SECTION = {
    1: <Step1 setEmail={setEmail} setStep={setStep} />,
    2: <Step2 email={email} setOtp={setOtp} setStep={setStep} />,
    3: <Step3 email={email} otp={otp} />,
  };

  useEffect(() => {
    if (open) setStep(1);
  }, [open]);

  return (
    <>
      <CContainer onClick={onOpen} w={"fit"} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Reset Password`} />
          </DisclosureHeader>

          {STEP_SECTION[step as keyof typeof STEP_SECTION]}
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default ResetPasswordDisclosureTrigger;
