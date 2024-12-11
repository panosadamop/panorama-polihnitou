import React, { useState } from 'react';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonModal,
    IonContent,
} from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';

const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    {/* Left: Menu Button */}
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>

                    {/* Center: Logo */}
                    <IonTitle>
                        <img
                            src="https://panoramapolihnitou.gr/wp-content/uploads/2024/10/panorama-logo.png"
                            alt="Logo"
                            style={{ height: '30px', display: 'block', margin: 'auto' }}
                        />
                    </IonTitle>

                    {/* Right: Info Icon */}
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsModalOpen(true)}>
                            <IonIcon icon={informationCircleOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            {/* Modal */}
            <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>About Us</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsModalOpen(false)}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <p>
                        This is a demo application built using Ionic Framework. You can
                        customize this content as needed.
                    </p>
                </IonContent>
            </IonModal>
        </>
    );
};

export default Header;
