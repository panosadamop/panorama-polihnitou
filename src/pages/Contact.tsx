import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonInput, IonButton } from '@ionic/react';
import axios from 'axios';

const Contact: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async () => {
        try {
            await axios.post('https://your-server-url.com/send-email', {
                ...form,
                to: 'info@panorama.gr',
            });
            alert('Message sent successfully!');
        } catch (error) {
            alert('Failed to send the message.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <h1>Contact Us</h1>
            </IonHeader>
            <IonContent>
                <IonInput placeholder="Name" onIonChange={(e) => setForm({ ...form, name: e.detail.value! })} />
                <IonInput placeholder="Email" onIonChange={(e) => setForm({ ...form, email: e.detail.value! })} />
                <IonInput placeholder="Message" onIonChange={(e) => setForm({ ...form, message: e.detail.value! })} />
                <IonButton onClick={handleSubmit}>Submit</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Contact;

