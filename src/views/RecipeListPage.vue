<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Recipes</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Finding recipes...</p>
      </div>
      
      <div v-else-if="recipes.length > 0">
        <ion-list>
          <ion-item v-for="recipe in recipes" :key="recipe.idMeal" button @click="viewRecipe(recipe)">
            <ion-thumbnail slot="start">
              <img :src="recipe.strMealThumb" />
            </ion-thumbnail>
            <ion-label>{{ recipe.strMeal }}</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <div v-else class="empty-container">
        <p>No recipes found for these ingredients.</p>
        <ion-button router-link="/home">Try different ingredients</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonThumbnail, IonSpinner, IonButton
} from '@ionic/vue';
import { findRecipesByIngredients, findRecipesByLocation, Recipe } from '@/services/RecipeService';

const route = useRoute();
const router = useRouter();
const recipes = ref<Recipe[]>([]);
const loading = ref(true);

onMounted(async () => {
  const ingredientsStr = route.query.ingredients as string;
  const lat = route.query.lat as string;
  const lng = route.query.lng as string;

  if (ingredientsStr) {
    const ingredients = ingredientsStr.split(',');
    try {
      loading.value = true;
      recipes.value = await findRecipesByIngredients(ingredients);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else if (lat && lng) {
    try {
      loading.value = true;
      const ingredients = ingredientsStr ? ingredientsStr.split(',') : [];
      recipes.value = await findRecipesByLocation(parseFloat(lat), parseFloat(lng), ingredients);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});

const viewRecipe = (recipe: Recipe) => {
  const ingredientsStr = route.query.ingredients as string;
  router.push({
    path: '/recipe',
    query: {
      name: recipe.strMeal,
      ingredients: ingredientsStr // Pass original available ingredients
    }
  });
};
</script>

<style scoped>
.loading-container, .empty-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
  text-align: center;
}
</style>
