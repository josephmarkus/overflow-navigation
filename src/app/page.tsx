"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import styles from "./page.module.css";

type NavProps = {
  label: string;
  show: boolean;
  width: "auto" | number;
}[];

const PRIMARY_NAV: NavProps = [
  { label: "Home", show: true, width: "auto" },
  { label: "Israel-Gaza war", show: true, width: "auto" },
  { label: "Cost of Living", show: true, width: "auto" },
  { label: "War in Ukraine", show: true, width: "auto" },
  { label: "Climate", show: true, width: "auto" },
  { label: "UK", show: true, width: "auto" },
  { label: "World", show: true, width: "auto" },
  { label: "Business", show: true, width: "auto" },
  { label: "Politics", show: true, width: "auto" },
  { label: "Culture", show: true, width: "auto" },
  { label: "Tech", show: true, width: "auto" },
  { label: "Science", show: true, width: "auto" },
  { label: "Health", show: true, width: "auto" },
  { label: "Family & Education", show: true, width: "auto" },
];

const SECONDARY_NAV: NavProps = [
  { label: "In Pictures", show: true, width: "auto" },
  { label: "Newsbeat", show: true, width: "auto" },
  { label: "BBC Verify", show: true, width: "auto" },
  { label: "Disability", show: true, width: "auto" },
];

const DEBOUNCE_IN_MS = 500;

export default function Home() {
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const [links, setLinks] = useState(PRIMARY_NAV);

  const handleResize = useCallback(() => {
    const toggleRefWidth =
      toggleRef.current?.getBoundingClientRect().width || 0;
    const leftAndRightPadding = 16 * 2;
    const availableWidth = Math.floor(
      window.outerWidth - leftAndRightPadding - toggleRefWidth,
    );
    let itemTotalWidth = 0;
    const newLinks = links.map((link) => {
      const width = link.width as number;
      itemTotalWidth += width;

      return {
        ...link,
        show: width > 0 && itemTotalWidth < availableWidth ? true : false,
      };
    });

    setLinks(newLinks);
  }, [links]);

  const handleClick = () => {
    setShowOverflow(!showOverflow);
  };

  // Check how many items fit on screen on initial render AFTER nav
  // items rendered on page and their widths are available via refs
  useEffect(() => {
    handleResize();
    // no need for handleResize as dependency as it ends up in an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculated]);

  // Calculate navigation item width once on render and save the value
  useEffect(() => {
    const withWidth = links.map((link, index) => {
      const itemWidth = itemsRef.current[index]?.getBoundingClientRect().width;
      return {
        ...link,
        width: Math.floor(itemWidth || 0),
      };
    });

    setLinks(withWidth);
    setIsCalculated(true);
    // no need for links as dependency as this should only be called once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Attach event listeners for browser window resizing
  // Debounce calls, so function isn't invoked on every pixel changed
  useEffect(() => {
    window.addEventListener("resize", debounce(handleResize, DEBOUNCE_IN_MS), {
      passive: true,
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <main>
      <div className={styles.outerContainer}>
        <nav className={styles.container}>
          <ul className={styles.list}>
            {links.map((link, index) => (
              <li
                key={link.label}
                className={styles.listItem}
                aria-hidden={!link.show}
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <a href="#" className={`${styles.link} ${styles.linkPrimary}`}>
                  <span
                    className={`${styles.linkText} ${styles.linkTextWithBorder}`}
                  >
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
            <li className={styles.listItem}>
              <span className={styles.buttonContainer}>
                <button
                  ref={toggleRef}
                  type="button"
                  className={`${styles.button} ${
                    showOverflow && styles.buttonActive
                  }`}
                  aria-expanded={showOverflow}
                  aria-haspopup={true}
                  onClick={handleClick}
                >
                  More &darr;
                </button>
              </span>
            </li>
          </ul>
        </nav>
        {showOverflow && (
          <div className={styles.overflowContainer}>
            <div className={styles.container}>
              <ul className={`${styles.list} ${styles.listWrap}`}>
                {links
                  .filter((link) => !link.show)
                  .map((link) => (
                    <li key={link.label}>
                      <a
                        href="#"
                        className={`${styles.link} ${styles.linkSecondary}`}
                      >
                        <span className={styles.linkText}>{link.label}</span>
                      </a>
                    </li>
                  ))}
                {SECONDARY_NAV.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className={`${styles.link} ${styles.linkSecondary}`}
                    >
                      <span className={styles.linkText}>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
