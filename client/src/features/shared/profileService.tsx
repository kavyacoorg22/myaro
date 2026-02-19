import { useState } from "react";
import { useSelector } from "react-redux";
import { Header } from "../public";
import { TabNavigation } from "./tabNavigation";
import { ProfileEditPage } from "../beautician/pages/editProfile";
import ServiceLocationForm from "../service/pages/locationPage";
import ServiceSetup from "../service/component/beautician/serviceSelection";
import ServicePageList from "../service/pages/serviceListPage";
import type { RootState } from "../../redux/appStore";
import { UserRole } from "../../constants/types/User";

const BeauticianProfileForm = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const isCustomer = user.role === UserRole.CUSTOMER;

  const [activeMainTab, setActiveMainTab] = useState<"profile" | "service">("profile");
  const [activeServiceTab, setActiveServiceTab] = useState<"list" | "add" | "update">("list");

  const mainTabs = [
    { id: "profile", label: "Edit Profile" },
    { id: "service", label: "Service Page" },
  ];

  const serviceTabs = [
    { id: "list", label: "View Services" },
    { id: "add", label: "Add Location" },
    { id: "update", label: "Add Service" },
  ];

  return (
    <>
      <Header />

      {/* ✅ Hide main tabs for customer */}
      {!isCustomer && (
        <TabNavigation
          tabs={mainTabs}
          activeTab={activeMainTab}
          onTabChange={(tab) => setActiveMainTab(tab as "profile" | "service")}
        />
      )}

      {/* ✅ Profile tab always shown, but ProfileEditPage handles what to render inside */}
      {(isCustomer || activeMainTab === "profile") && (
        <ProfileEditPage isCustomer={isCustomer} />
      )}

      {/* ✅ Service tab only for beautician */}
      {!isCustomer && activeMainTab === "service" && (
        <>
          <TabNavigation
            tabs={serviceTabs}
            activeTab={activeServiceTab}
            onTabChange={(tab) => setActiveServiceTab(tab as "list" | "add" | "update")}
          />
          {activeServiceTab === "list" && <ServicePageList />}
          {activeServiceTab === "add" && <ServiceLocationForm />}
          {activeServiceTab === "update" && <ServiceSetup />}
        </>
      )}
    </>
  );
};

export default BeauticianProfileForm;