import { useEffect, useState } from "react";

/**
 * PageTransition
 * Wraps any page and gives it a smooth fade + slight upward slide on mount.
 *
 * Usage:
 *   import PageTransition from "../../Components/PageTransition/PageTransition";
 *
 *   const MyPage = () => (
 *     <PageTransition>
 *       <div>... page content ...</div>
 *     </PageTransition>
 *   );
 */
const PageTransition = ({ children, className = "" }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // rAF ensures the initial invisible state is painted before we reveal
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
