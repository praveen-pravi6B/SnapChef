<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Recipe Finder</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-content>
                <img :src="imageUrl" v-if="imageUrl" />
                <div v-else class="placeholder">
                  <p>Take a photo to get started!</p>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Ingredients</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item v-for="(ingredient, index) in ingredients" :key="index">
                    <ion-label>{{ ingredient }}</ion-label>
                    <ion-button slot="end" @click="removeIngredient(index)" fill="clear">
                      <ion-icon :icon="closeCircle" />
                    </ion-button>
                  </ion-item>
                </ion-list>
                <ion-spinner v-if="isAnalyzing"></ion-spinner>
                  <div class="add-ingredient">
                    <ion-input v-model="newIngredient" placeholder="Add ingredient"></ion-input>
                    <ion-button @click="addIngredient" :disabled="!newIngredient">Add</ion-button>
                  </div>
                  <div class="ion-text-center ion-padding-top">
                    <ion-button expand="block" @click="findRecipes" :disabled="ingredients.length === 0 || isFetchingRecipes">
                      <ion-icon slot="start" :icon="search"></ion-icon>
                      Find Recipes
                    </ion-button>
                  </div>
                </ion-card-content>
            </ion-card>
            <ion-card>
              <ion-card-header>
                <ion-card-title>Recipes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list v-if="recipes.length > 0">
                  <ion-item v-for="recipe in recipes" :key="recipe.idMeal" button @click="viewRecipe(recipe)">
                    <ion-thumbnail slot="start">
                      <img :src="recipe.strMealThumb" />
                    </ion-thumbnail>
                    <ion-label>{{ recipe.strMeal }}</ion-label>
                  </ion-item>
                </ion-list>
                <ion-spinner v-if="isFetchingRecipes"></ion-spinner>
                <p v-if="!isFetchingRecipes && recipes.length === 0 && ingredients.length > 0">No recipes found.</p>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="takePhoto" :disabled="isAnalyzing || isFetchingRecipes">
          <ion-icon :icon="camera"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonSpinner, IonThumbnail, IonFab, IonFabButton, IonIcon, IonInput, IonButton
} from '@ionic/vue';
import { camera, closeCircle, search } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { analyzeImage } from '@/services/ImageAnalysis';
import { findRecipesByIngredients, Recipe } from '@/services/RecipeService';

const imageUrl = ref('');
const ingredients = ref<string[]>([]);
const recipes = ref<Recipe[]>([]);
const isAnalyzing = ref(false);
const isFetchingRecipes = ref(false);
const newIngredient = ref('');

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
  });

  if (image.webPath) {
    imageUrl.value = image.webPath;
    isAnalyzing.value = true;
    ingredients.value = [];
    recipes.value = [];
    try {
      const result = await analyzeImage(image.webPath);
      ingredients.value = result;
    } finally {
      isAnalyzing.value = false;
    }
  }
};

const addIngredient = () => {
  if (newIngredient.value) {
    ingredients.value.push(newIngredient.value);
    newIngredient.value = '';
  }
};

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1);
};

const router = useRouter();

const viewRecipe = (recipe: Recipe) => {
  router.push({
    path: '/tabs/recipe',
    query: {
      name: recipe.strMeal,
      ingredients: ingredients.value.join(',')
    }
  });
};

const findRecipes = async () => {
  if (ingredients.value.length === 0) return;
  
  isFetchingRecipes.value = true;
  recipes.value = []; // Clear previous results
  try {
    const recipeResult = await findRecipesByIngredients(ingredients.value);
    recipes.value = recipeResult;
  } finally {
    isFetchingRecipes.value = false;
  }
};

</script>

<style scoped>
.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 2px dashed var(--ion-color-medium);
  border-radius: 10px;
}
.add-ingredient {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>
