import Navbar from "@/components/Navbar";
import { getCmsData } from "@/lib/cms";
import { redirect } from "next/navigation";
import ContactClient from "./ContactClient";

export default async function ContactPage() {
  const cms = await getCmsData();
  const contact = cms.contactSettings;

  if (contact.showContactPage === false) {
    redirect("/");
  }

  return (
    <>
      <Navbar settings={cms.settings} showContact={true} />
      <ContactClient settings={cms.settings} contact={contact} />
    </>
  );
}
