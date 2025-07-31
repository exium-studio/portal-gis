import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import { HStack, Icon } from "@chakra-ui/react";
import { IconFolders } from "@tabler/icons-react";
import P from "../ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "../ui/accordion";
import ActiveLayerListItem from "./ActiveLayerListItem";
import CContainer from "../ui-custom/CContainer";

interface Props {
  activeWorkspace: Interface__ActiveWorkspace;
}

const ActiveWorkspaceListItem = (props: Props) => {
  // Props
  const { activeWorkspace } = props;

  return (
    <AccordionItem value={`${activeWorkspace.id}`}>
      <AccordionItemTrigger indicatorPlacement="none">
        <HStack px={1}>
          <Icon boxSize={5}>
            <IconFolders stroke={1.5} />
          </Icon>
          <P fontWeight={"semibold"}>{activeWorkspace.title}</P>
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent py={1}>
        <CContainer gap={1}>
          {activeWorkspace?.layers?.map((activeLayer) => {
            return (
              <ActiveLayerListItem
                key={activeLayer.id}
                activeLayer={activeLayer}
              />
            );
          })}
        </CContainer>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceListItem;
