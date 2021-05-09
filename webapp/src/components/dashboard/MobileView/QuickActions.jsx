import React from 'react';
import styled from "@emotion/styled";

const QuickLinkButton = styled.button`
    border: none!important;
    background: white;
    box-shadow: 2px 3px 5px rgba(0,0,0,0.25);
    text-align: center;  
    img {
        max-height: 64px;
        margin: 5px;
    }
    color: ${({theme}) => theme.colors.primary};
    font-weight: 600;
    padding: 0.5rem;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const QuickActions = ({
    onOpenTab = () => {}
}) => {

    return <div className="p-2">
        <h5 className="font-weight-bold">Quick Links</h5>
        <div className="row mx-0">
            <div className="col-6 p-2">
                <QuickLinkButton onClick={() => onOpenTab('webinar')}>
                    <div>
                        <img
                            alt="Webinar"
                            src={require('../../../assets/icons/zoom_app.png')}
                        />
                        <div>Conference Links</div>
                    </div>

                </QuickLinkButton>
            </div>
            <div className="col-6 p-2">
                <QuickLinkButton onClick={() => onOpenTab('profile')}>
                   <div>
                       <img
                           alt="Registrations"
                           src={require('../../../assets/icons/my_registrations.png')}
                       />
                       <div>My Registrations</div>
                   </div>
                </QuickLinkButton>
            </div>
            <div className="col-6 p-2">
                <QuickLinkButton onClick={() => onOpenTab('profile')}>
                   <div>
                       <img
                           alt="Webinar"
                           src={require('../../../assets/icons/id_card_verified.png')}
                       />
                       <div>My ID Card</div>
                   </div>
                </QuickLinkButton>
            </div>
            <div className="col-6 p-2">
                <QuickLinkButton  onClick={() => onOpenTab('competition')}>
                    <div>
                        <img
                            alt="Competition"
                            src={require('../../../assets/icons/competition.png')}
                        />
                        <div>Competitions</div>
                    </div>
                </QuickLinkButton>
            </div>
        </div>
    </div>

};

export default QuickActions;