import styled from "@emotion/styled";
import {Button} from "srx";

const FormButton = styled(Button)`
    color: ${({ background, theme }) => background ? `white!important` : `${theme?.colors.primaryInv}!important` };
    background: ${({ background, theme }) => background ? background : `${theme?.colors.primary}!important`};
    transition: all 0.25s ease-in;
    box-shadow: 3px 5px 8px rgba(0,0,0,0.3);
    &:hover, &:focus{
       box-shadow: none!important;
       transition: all 0.25s ease-in;
    }
`;



export default FormButton;