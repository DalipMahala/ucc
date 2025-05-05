"use client"
import { useState, useEffect } from "react";
import { usePathname, useRouter  } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";
import PhoneMenu from "./PhoneMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children  }: LayoutProps) => {
  const [loading, setLoading] = useState(false);
  const [delayedLoading, setDelayedLoading] = useState(false); // Delayed loader state
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setLoading(false); // Stop loader when page changes
    setDelayedLoading(false); // Ensure loader resets on route change
  }, [pathname]);

   // Function to start loader on link click
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a") as HTMLAnchorElement | null;

    if (link) {
      const href = new URL(link.href, window.location.origin).pathname;

      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
        return;
      }
      // Only show loader if navigating to a new page
      if (href !== pathname) {
        setLoading(true);
         // Start a timer to show the loader after 5 seconds
         const timer = setTimeout(() => {
          setDelayedLoading(true); // Show loader only if page is still loading after 5s
        }, 2000);

        // Cleanup the timer when the effect runs again
        return () => clearTimeout(timer);
      }
    }
  };

  useEffect(() => {
    // Handle back/forward navigation
    const handlePopstate = () => {
      router.refresh(); // Ensures client and server states match
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [router]);
 

  return (
    <>
    {delayedLoading  && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}
      <div  onClick={handleClick}>
      <Header/>
      <main  >
      {children}
      </main>
      <Footer />
      <PhoneMenu /> 
      </div>
    </>
  );
};

export default Layout;
