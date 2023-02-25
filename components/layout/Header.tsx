import { MouseEvent, useState, FC, useEffect } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import { throttle } from "../../utils/throttle-functions";
import { medias, colors } from "../../styles/style-variables";
import HightlightLink from "../reusable/HighlightLink";
import SocialLinks from "./headerParts/SocialLinks";
import LightbulbBtn from "./headerParts/LightbulbBtn";

const HeaderComponent = styled.header<{ sticky: boolean }>`
  z-index: 1;
  position: sticky;
  top: -1px;
  ${({ sticky }) => {
    if (sticky) {
      return css`
        .navigation {
          transform: translateY(0%);
        }
      `;
    } else {
      return css`
        .navigation {
          transform: translateY(-100%);
        }
      `;
    }
  }}
  @media only screen and (max-width: ${medias.phone + "px"}) {
  }
  .navigation {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    transition: transform 300ms;
    background-color: ${colors.richBlack};
    border-bottom: 1px solid ${colors.white};
    @media only screen and (min-width: ${medias.phone + 1 + "px"}) and (max-width: ${medias.tablet + "px"}) {
    }
    @media only screen and (max-width: ${medias.phone + "px"}) {
      width: 100%;
      padding: 10px;
    }
  }
`;
const DropdownContainer = styled.div`
  position: relative;
  @media only screen and (max-width: ${medias.phone + "px"}) {
    display: flex;
    justify-content: flex-end;
    width: calc(100% - 2px);
  }
  .route_container {
    z-index: 1;
    position: absolute;
    right: -5px;
    top: -5px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    row-gap: 40px;
    padding: 85px 50px 40px;
    background-color: ${colors.darkGray};
    overflow: hidden;
    transition: transform 300ms;
    transform-origin: top right;
    border-radius: 8px;
    box-shadow: -6px 8px 12px #0a090536;
    &[aria-hidden="true"] {
      user-select: none;
      pointer-events: none;
      transform: scale(0);
      @media only screen and (max-width: ${medias.phone + "px"}) {
        transform: scaleY(0);
      }
      .link-container,
      .social-container {
        opacity: 0;
        transition-delay: 0ms;
      }
    }
    &[aria-hidden="false"] {
      transform: scale(1);
      overflow: hidden;
      @media only screen and (max-width: ${medias.phone + "px"}) {
        transform: scaleY(1);
      }
      &:before {
        position: absolute;
        content: "";
        width: 200%;
        height: 200%;
        top: 0;
        right: 0;
        pointer-events: none;
        background-image: radial-gradient(#66604d, transparent 70%);
        transform: translate(calc(50% - 20px), calc(-50% + 20px));
        opacity: 0;
        animation: light-flicker 150ms forwards;
        animation-delay: 300ms;
        @keyframes light-flicker {
          from {
            opacity: 0.1;
          }
          20% {
            opacity: 0;
          }
          45% {
            opacity: 0.15;
          }
          65% {
            opacity: 0;
          }
          100% {
            opacity: 0.2;
          }
        }
      }
      .link-container,
      .social-container {
        --default-op: 0.05;
        opacity: var(--default-op);
        animation: light-reflect 150ms forwards;
        animation-delay: 300ms;
        @keyframes light-reflect {
          from {
            opacity: 0.7;
          }
          20% {
            opacity: var(--default-op);
          }
          45% {
            opacity: 0.8;
          }
          65% {
            opacity: var(--default-op);
          }
          100% {
            opacity: 1;
          }
        }
      }
    }
    @media only screen and (max-width: ${medias.phone + "px"}) {
      top: -10px;
      right: -10px;
      width: calc(100% + 20px);
      height: calc(100vh + 1px);
      border-radius: 0px;
      justify-content: space-between;
      padding: max(15vh, 100px) 50px;
      min-height: 400px;
      box-shadow: none;
    }
    .link-container {
      transition: opacity 200ms;
      svg {
        fill: white;
        width: 30px;
        height: 30px;
        &:hover {
          animation: gh-jiggle 300ms;
          animation-iteration-count: 2;
          @keyframes gh-jiggle {
            25% {
              transform: rotate(35deg);
            }
            50% {
              transform: rotate(-35deg);
            }
            75% {
              transform: rotate(35deg);
            }
          }
        }
      }
    }
  }
`;

const Header: FC = () => {
  const [navState, setNavState] = useState({
    ariaHidden: true,
    ariaPressed: false,
    sticky: true,
  });
  const router = useRouter();

  const handleDropdownBtn = (e: MouseEvent<HTMLButtonElement>) => {
    const innerContainer = document.querySelector("body");
    innerContainer?.classList.toggle("nav-open");
    setNavState((currState) => ({
      ...currState,
      ariaPressed: !currState.ariaPressed,
      ariaHidden: !currState.ariaHidden,
    }));
  };
  useEffect(() => {
    const routeChageStartHandle = () => {
      setNavState((currState) => ({
        ...currState,
        ariaHidden: true,
        ariaPressed: false,
      }));
    };
    let prevPosY = 0,
      navVisible = true;
    const handleNavSticky = throttle(() => {
      const navHeight = window.innerWidth > 1100 ? 120 : window.innerWidth > 500 ? 110 : 80;
      const posY = window.scrollY;
      if (posY > navHeight && posY > prevPosY) {
        setNavState((currState) => ({
          ...currState,
          sticky: false,
          ariaHidden: true,
          ariaPressed: false,
        }));
        navVisible = false;
      } else {
        setNavState((currState) => ({
          ...currState,
          sticky: true,
        }));
        navVisible = true;
      }
      prevPosY = posY;
    }, 50);
    router.events.on("routeChangeStart", routeChageStartHandle);
    window.addEventListener("scroll", handleNavSticky);
    return () => {
      router.events.off("routeChangeStart", routeChageStartHandle);
      window.removeEventListener("scroll", handleNavSticky);
    };
  }, [router]);
  console.log(navState.sticky);
  return (
    <HeaderComponent sticky={navState.sticky}>
      <div className="navigation">
        <DropdownContainer>
          <LightbulbBtn id="dropdown-btn" className="dropdownButton" onClick={handleDropdownBtn} ariaPressed={navState.ariaPressed} />
          <ul id="route_container" className="route_container" role="presentation" aria-hidden={navState.ariaHidden}>
            {router.asPath !== "/" && (
              <li className="link-container">
                <HightlightLink href="/">Home</HightlightLink>
              </li>
            )}
            {router.asPath !== "/projects" && (
              <li className="link-container">
                <HightlightLink href="/projects">Projects</HightlightLink>
              </li>
            )}
            {router.asPath !== "/about" && (
              <li className="link-container">
                <HightlightLink href="/about">About</HightlightLink>
              </li>
            )}
            {router.asPath !== "/contact" && (
              <li className="link-container">
                <HightlightLink href="/contact">Contact</HightlightLink>
              </li>
            )}
            <SocialLinks />
          </ul>
        </DropdownContainer>
      </div>
    </HeaderComponent>
  );
};

export default Header;
