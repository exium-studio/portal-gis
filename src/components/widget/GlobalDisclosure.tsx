import ConfirmationDisclosure from "./ConfirmationDisclosure";
import OfflineDisclosure from "./OfflineDisclosure";
// import ToasterDetailDisclosure from "./ToasterDetailDisclosure";

const GlobalDisclosure = () => {
  return (
    <>
      <OfflineDisclosure />

      <ConfirmationDisclosure />

      {/* <ToasterDetailDisclosure /> */}
    </>
  );
};

export default GlobalDisclosure;
