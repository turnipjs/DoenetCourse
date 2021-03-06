import React from "react";
import styled from "styled-components";


const HeaderMenuPanelContainer = styled.div`
  z-index: 6;
  right: 240px ;
  width: 240px;
  border: 1px solid black;
  position:absolute;
  overflow: hidden;
  top:27px;
  &.on {
    margin-top: 1.5%;
  }
   
  &.off {
    display: none;
  }

  @media (max-width: 767px){
    z-index: 6;
    left: 0;
    width: 100%;
    height: 100%;
    position:absolute;
    overflow-y: hidden;
    &.on {
      margin-top: 1.5%;
    }
     
    &.off {
      display:none;
    }
  }
`;
const HeaderMenuPanelContentContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const HeaderMenuPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  height: calc(100vh - 50px);
  overflow: scroll;
  background-color:white;
  top:50px;
`;



export default function HeaderMenuPanelContent(props) {
console.log(props.open, "props.open");
  return (
    <HeaderMenuPanelContainer
      className={props.open ? 'on' : 'off'}
    >
      <HeaderMenuPanelContentContainer>
        <HeaderMenuPanel>{props.body}</HeaderMenuPanel>
      </HeaderMenuPanelContentContainer>
    </HeaderMenuPanelContainer>
  );
}
