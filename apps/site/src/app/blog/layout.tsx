import Footer from '@/components/layout/footer';
import Header from '@/components/layout/blog-header/header';
import AnnouncementBanner from '@/components/layout/announcement-banner'
//import FloatingAnnouncement from '@/components/layout/floating-announcement';

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark:bg-[#101828] flex flex-col flex-1">
      <AnnouncementBanner />
      <Header />
      {/* <FloatingAnnouncement /> */}
      <div className="isolate flex-1 flex flex-col">{children}</div>
      <Footer />
    </div>
  );
}
