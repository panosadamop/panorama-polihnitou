import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonText,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import { getPosts } from '../api/axiosConfig';
import Header from "../components/Header";

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Track if more posts are available
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Record<number, string>>({}); // Map of category IDs to names

    const fetchPosts = async (page: number, replace = false) => {
        setLoading(true);
        try {
            const response = await getPosts({ page, per_page: 10 }); // Pagination parameters
            if (response.data.length > 0) {
                if (replace) {
                    setPosts(response.data); // Replace posts for refresh
                } else {
                    setPosts((prevPosts) => [...prevPosts, ...response.data]);
                }
            } else {
                setHasMore(false); // No more posts to load
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const decodeHtmlEntities = (text: string) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };


    useEffect(() => {
        // Fetch posts when the component is mounted
        fetchPosts(1, true); // Fetch the first page with replace mode
    }, []);

    const loadMorePosts = () => {
        if (hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    const handleRefresh = (event: CustomEvent) => {
        fetchPosts(1, true).then(() => {
            event.detail.complete(); // Signal that the refresh is complete
        });
    };

    if (loading && posts.length === 0) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <IonSpinner /> Loading posts...
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <Header />
            <IonContent>
                {/* Pull-to-Refresh */}
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingText="Pull to refresh"
                        refreshingSpinner="circles"
                        refreshingText="Refreshing..."
                    />
                </IonRefresher>

                {posts.length > 0 ? (
                    posts.map((post) => (
                        <IonCard key={post.id} routerLink={`/post-details/${post.id}`}>
                            {post.featured_media_url && (
                                <IonImg src={post.featured_media_url} alt={decodeHtmlEntities(post.title.rendered)} />
                            )}
                            <IonCardHeader>
                                <IonCardTitle>{decodeHtmlEntities(post.title.rendered)}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                                <IonText>
                                    <strong>Categories:</strong>{' '}
                                    {post.categories.map((categoryId: number, index: number) => (
                                        <span key={categoryId}>
                      {categories[categoryId] || 'Uncategorized'}
                                            {index < post.categories.length - 1 ? ', ' : ''}
                    </span>
                                    ))}
                                </IonText>
                            </IonCardContent>
                        </IonCard>
                    ))
                ) : (
                    <IonText>No posts found.</IonText>
                )}

                {/* Infinite Scroll */}
                <IonInfiniteScroll
                    threshold="100px"
                    onIonInfinite={(e: CustomEvent<void>) => {
                        loadMorePosts();
                        (e.target as HTMLIonInfiniteScrollElement).complete();
                    }}
                    disabled={!hasMore}
                >
                    <IonInfiniteScrollContent loadingText="Loading more posts...">
                        {loading && <IonSpinner />}
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default PostList;
