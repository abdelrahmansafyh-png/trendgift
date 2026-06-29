import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Business, Categories, CustomOrder, Products } from "@/components/Sections";
import { getCmsData } from "@/lib/cms";
import SocialIcons from "@/components/SocialIcons";

export default async function Home() {
  const cms = await getCmsData();
  return (
    <>
      <Navbar settings={cms.settings} showContact={cms.contactSettings.showContactPage !== false} />
      <HeroSlider slides={cms.heroSlides} settings={cms.settings} />
      <Categories categories={cms.categories} />
      <Products products={cms.products} showPrices={cms.settings.showProductPrices !== false} />
      <CustomOrder products={cms.products} settings={cms.settings} contactSettings={cms.contactSettings} />
      <div style={{ height: "50px" }} />
      <Business />
      <SocialIcons contact={cms.contactSettings} variant="home" showTitle />
      {cms.contactSettings.showFloatingWhatsapp !== false && <FloatingWhatsApp phone={cms.contactSettings.whatsapp || cms.settings.whatsapp} />}
      <footer className="footer footerWithLogo"><img src="/logo/trend-logo.png" alt="Trend" className="footerLogo" /><span className="arOnly">TrendGift — هدايا مخصصة، NFC و QR</span><span className="enOnly">TrendGift — Custom Gifts, NFC & QR</span></footer>
    </>
  );
}
