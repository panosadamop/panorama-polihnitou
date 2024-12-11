import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonContent } from '@ionic/react';
import { getPages } from '../api/axiosConfig';

const SitePages: React.FC = () => {
    const [pages, setPages] = useState<any[]>([]);

    useEffect(() => {
        getPages().then((response) => setPages(response.data));
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <h1>Site Pages</h1>
            </IonHeader>
            <IonContent>
                {pages.map((page) => (
                    <div key={page.id}>
                        <h2>{page.title.rendered}</h2>
                        <p dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
                    </div>
                ))}
            </IonContent>
        </IonPage>
    );
};

export default SitePages;
