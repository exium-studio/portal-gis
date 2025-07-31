import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import {
  AccordionItem,
  AccordionItemContent,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { IconFolders } from "@tabler/icons-react";
import P from "../ui-custom/P";
import { AccordionItemTrigger } from "../ui/accordion";
import ActiveLayerListItem from "./ActiveLayerListItem";

interface Props {
  activeWorkspace: Interface__ActiveWorkspace;
}

const ActiveWorkspaceListItem = (props: Props) => {
  // Props
  const { activeWorkspace } = props;

  return (
    <AccordionItem value={`${activeWorkspace.id}`}>
      <AccordionItemTrigger>
        <HStack px={1}>
          <Icon boxSize={5}>
            <IconFolders stroke={1.5} />
          </Icon>
          <P fontWeight={"semibold"}>{activeWorkspace.title}</P>
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent>
        {activeWorkspace?.layers?.map((activeLayer) => {
          return (
            <ActiveLayerListItem
              key={activeLayer.id}
              activeLayer={activeLayer}
            />
          );
        })}
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceListItem;
