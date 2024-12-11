import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
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
    IonFooter,
    IonToolbar,
    IonRefresher,
    IonRefresherContent,
} from '@ionic/react';
import {getPosts, api} from '../api/axiosConfig';
import Header from "../components/Header"; // Ensure api is imported for category fetching

const ArticlesByCategory: React.FC = () => {
    const {id} = useParams<{ id: string }>(); // Category ID from the URL
    const [categoryLabel, setCategoryLabel] = useState<string>('Category'); // Default label
    const [posts, setPosts] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Track if more posts are available
    const [loading, setLoading] = useState(false);

    const fetchCategoryLabel = async () => {
        try {
            const response = await api.get(`categories/${id}`); // Fetch category details by ID
            setCategoryLabel(response.data.name); // Set category label
        } catch (error) {
            console.error('Error fetching category label:', error);
        }
    };

    const fetchCategoryPosts = async (page: number, replace = false) => {
        setLoading(true);
        try {
            const response = await getPosts({categories: id, page, per_page: 10}); // Fetch posts for the category
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
            console.error('Error fetching category posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch category label when the component is mounted or when the category ID changes
        fetchCategoryLabel();
        fetchCategoryPosts(1, true); // Fetch the first page with replace mode
    }, [id]);

    const loadMorePosts = () => {
        if (hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchCategoryPosts(nextPage);
        }
    };

    const handleRefresh = (event: CustomEvent) => {
        fetchCategoryPosts(1, true).then(() => {
            event.detail.complete(); // Signal that the refresh is complete
        });
    };

    if (loading && posts.length === 0) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <IonSpinner/> Loading articles...
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <Header/>
            {/* Category Name Display */}
            <IonText color="primary" className="ion-margin">
                <h2 style={{ textAlign: 'center' }}>{categoryLabel}</h2>
            </IonText>
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
                                <IonImg src={post.featured_media_url} alt={post.title.rendered}/>
                            )}
                            <IonCardHeader>
                                <IonCardTitle>{post.title.rendered}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <div dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}/>
                                <IonText>
                                    <strong>Tags:</strong>{' '}
                                    {post.tags.map((tag: string, index: number) => (
                                        <span key={index}>
                      {tag}
                                            {index < post.tags.length - 1 ? ', ' : ''}
                    </span>
                                    ))}
                                </IonText>
                            </IonCardContent>
                        </IonCard>
                    ))
                ) : (
                    <IonText>No articles found in this category.</IonText>
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
                    <IonInfiniteScrollContent loadingText="Loading more articles...">
                        {loading && <IonSpinner/>}
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </IonContent>
        </IonPage>
    );
};

export default ArticlesByCategory;
