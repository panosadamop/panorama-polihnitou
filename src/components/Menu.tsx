import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonItem,
  IonList,
  IonListHeader,
  IonMenu,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonImg,
} from "@ionic/react";
import { getCategories } from "../api/axiosConfig";

const Menu: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Infinite scroll tracking
  const [isFetching, setIsFetching] = useState(false); // Prevent duplicate API calls

  const fetchCategories = async (page: number) => {
    // Guard against duplicate calls
    if (isFetching || !hasMore) return;

    setIsFetching(true); // Prevent multiple simultaneous calls
    try {
      const response = await getCategories({
        params: { page, per_page: 10 }, // Paginated categories
      });

      if (response.data.length > 0) {
        // Prevent duplicates
        const newCategories = response.data.filter(
            (category: any) => !categories.some((cat) => cat.id === category.id)
        );
        setCategories((prev) => [...prev, ...newCategories]);
      } else {
        setHasMore(false); // Stop infinite scroll if no more categories
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setHasMore(false); // Stop fetching on error
    } finally {
      setIsFetching(false); // Reset fetching state
    }
  };

  useEffect(() => {
    // Fetch initial categories once
    fetchCategories(1);
  }, []); // Empty dependency array ensures this runs only once on mount

  const loadMoreCategories = () => {
    if (!hasMore || isFetching) return; // Guard against unnecessary calls
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCategories(nextPage);
  };

  return (
      <IonMenu contentId="main" type="overlay">
        <IonContent>
          {/* Top Image */}
          <IonImg
              src="https://panoramapolihnitou.gr/wp-content/uploads/2024/10/panorama-logo.png"
              alt="Menu Header"
              style={{ width: "70%", objectFit: "cover" }}
          />

          <IonList>
            {/* Static Menu Items */}
            <IonItem routerLink="/post-list">Αρθρογραφία</IonItem>
            <IonItem routerLink="/pages">Site Pages</IonItem>
            <IonItem routerLink="/contact">Επικοινωνία</IonItem>

            {/* Dynamic Categories */}
            <IonListHeader style={{ fontWeight: "bold", fontSize: "18px" }}>Menu</IonListHeader>
            {categories.map((category) => (
                <IonItem
                    key={category.id}
                    routerLink={`/category/${category.id}`}
                    detail={false}
                >
                  {category.name}
                </IonItem>
            ))}
          </IonList>

          {/* Infinite Scroll */}
          <IonInfiniteScroll
              threshold="100px"
              onIonInfinite={(e: CustomEvent<void>) => {
                loadMoreCategories();
                (e.target as HTMLIonInfiniteScrollElement).complete();
              }}
              disabled={!hasMore}
          >
            <IonInfiniteScrollContent loadingText="Loading more categories...">
              {isFetching && <IonSpinner />}
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonMenu>
  );
};

export default Menu;
