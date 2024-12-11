import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {IonPage, IonHeader, IonContent, IonImg, IonGrid, IonRow, IonText} from '@ionic/react';
import { getPostById } from '../api/axiosConfig';
import Header from "../components/Header";

const PostDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<any>(null);

    useEffect(() => {
        getPostById(parseInt(id)).then((response) => {
            setPost({
                ...response.data,
                featured_media_url: response.data.featured_media_url, // Get the featured image URL
                tags: response.data.tags, // Get tags if provided
            });
        });
    }, [id]);

    const decodeHtmlEntities = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };


    return (
        <IonPage>
            <Header />
            <IonText color="primary" className="ion-margin">
                <h2 style={{ textAlign: 'center' }}>{decodeHtmlEntities(post?.title.rendered)}</h2>
            </IonText>
            <IonContent>
                <IonGrid>
                    <IonRow>
                {post?.featured_media_url && (
                    <IonImg src={post.featured_media_url} alt={decodeHtmlEntities(post.title.rendered)} />
                )}
                        <div
                            dangerouslySetInnerHTML={{
                                __html: post?.content.rendered.slice(30), // Remove the first 30 characters
                            }}
                        />
                        <div>
                            <strong>Tags:</strong>{' '}
                            {post?.tags.map((tag: string, index: number) => (
                        <span key={index}>{tag}{index < post.tags.length - 1 ? ', ' : ''}</span>
                    ))}
                </div>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default PostDetails;
