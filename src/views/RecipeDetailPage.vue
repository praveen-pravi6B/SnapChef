<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tab1"></ion-back-button>
        </ion-buttons>
        <ion-title>Recipe Details</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="loading" class="loading-container">
        <ion-spinner></ion-spinner>
        <p>Generating instructions...</p>
      </div>
      <div v-else-if="recipe" class="recipe-content">
        <img :src="recipeImage" class="recipe-image" />
        <h1>{{ recipe.strMeal }}</h1>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Ingredients</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <!-- Fallback to old list if structuredIngredients is not present -->
              <div v-if="!recipe.structuredIngredients">
                <ion-item v-for="(ingredient, index) in recipe.ingredients" :key="index">
                  <ion-label>{{ ingredient }}</ion-label>
                </ion-item>
              </div>

              <!-- New structured list with availability indicators -->
              <div v-else>
                <ion-item v-for="(ing, index) in recipe.structuredIngredients" :key="index">
                  <ion-icon 
                    :icon="ing.isAvailable ? checkmarkCircle : closeCircle" 
                    :color="ing.isAvailable ? 'success' : 'medium'"
                    slot="start"
                  ></ion-icon>
                  <ion-label>
                    <h3>{{ ing.name }}</h3>
                    <p>{{ ing.amount }}</p>
                  </ion-label>
                </ion-item>
              </div>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Instructions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(step, index) in recipe.instructions" :key="index">
                <ion-badge slot="start" color="primary">{{ index + 1 }}</ion-badge>
                <ion-label class="ion-text-wrap">{{ step }}</ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
      </div>
      <div v-else class="error-container">
        <p>Failed to load recipe details.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonIcon
} from '@ionic/vue';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import { getRecipeDetails, Recipe } from '@/services/RecipeService';

const route = useRoute();
const recipe = ref<Recipe | null>(null);
const loading = ref(true);
const recipeImage = ref('');

onMounted(async () => {
  const name = route.query.name as string;
  const ingredientsStr = route.query.ingredients as string;
  const ingredients = ingredientsStr ? ingredientsStr.split(',') : [];
  
  if (name) {
    recipeImage.value = `https://placehold.co/600x400?text=${encodeURIComponent(name)}`;
    recipe.value = await getRecipeDetails(name, ingredients);
  }
  loading.value = false;
});
</script>

<style scoped>
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.recipe-content {
  padding-bottom: 20px;
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
h1 {
  padding: 16px;
  margin: 0;
  font-size: 24px;
}
</style>
