import useCurrentLocation from "@/context/useCurrentLocation";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import getLocation from "@/utils/getLocation";
import { useState } from "react";
import { OverlayItemContainer } from "../OverlayItemContainer";
import { Tooltip } from "@/components/ui/tooltip";
import BButton from "@/components/ui-custom/BButton";
import {
  IconCurrentLocation,
  IconCurrentLocationFilled,
} from "@tabler/icons-react";

export const CurrentLocation = () => {
  // Contexts
  const { l } = useLang();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const [loading, setLoading] = useState<boolean>(false);

  // Utils
  function handleOnClick() {
    if (currentLocation) {
      setCurrentLocation(undefined);
    } else {
      setLoading(true);
      getLocation()
        .then((loc) => {
          setCurrentLocation({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <OverlayItemContainer>
      <Tooltip content={l.current_location}>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          onClick={handleOnClick}
          loading={loading}
        >
          {currentLocation ? (
            <IconCurrentLocationFilled color={themeConfig.primaryColorHex} />
          ) : (
            <IconCurrentLocation stroke={1.5} />
          )}
        </BButton>
      </Tooltip>
    </OverlayItemContainer>
  );
};
