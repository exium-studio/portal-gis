import ConfirmationDisclosure from "./ConfirmationDisclosure";
import OfflineDisclosure from "./OfflineDisclosure";
import WorkspaceDetailGlobalDisclosure from "./WorkspaceDetailGlobalDisclosure";
// import ToasterDetailDisclosure from "./ToasterDetailDisclosure";

const GlobalDisclosure = () => {
  return (
    <>
      <OfflineDisclosure />

      <ConfirmationDisclosure />

      <WorkspaceDetailGlobalDisclosure />

      {/* <ToasterDetailDisclosure /> */}
    </>
  );
};

export default GlobalDisclosure;
