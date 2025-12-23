<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>SnapChef</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6" offset-md="3">
            <ion-card>
              <ion-card-content>
                <img :src="imageUrl" v-if="imageUrl" class="captured-image" />
                <div v-else class="placeholder" @click="takePhoto">
                  <ion-icon :icon="camera" size="large"></ion-icon>
                  <p>Tap to take a photo</p>
                </div>
              </ion-card-content>
            </ion-card>

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
                  <ion-input v-model="newIngredient" placeholder="Add ingredient" data-testid="ingredient-input"></ion-input>
                  <ion-button @click="addIngredient" :disabled="!newIngredient" data-testid="add-btn">Add</ion-button>
                </div>

                <div class="ion-text-center ion-padding-top">
                  <ion-button expand="block" @click="findRecipes" :disabled="ingredients.length === 0">
                    <ion-icon slot="start" :icon="search"></ion-icon>
                    Find Recipes
                  </ion-button>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="takePhoto" :disabled="isAnalyzing">
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
  IonList, IonItem, IonLabel, IonSpinner, IonFab, IonFabButton, IonIcon, IonInput, IonButton
} from '@ionic/vue';
import { camera, closeCircle, search } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { analyzeImage } from '@/services/ImageAnalysis';

const imageUrl = ref('');
const ingredients = ref<string[]>([]);
const isAnalyzing = ref(false);
const newIngredient = ref('');
const router = useRouter();

const takePhoto = async () => {
  try {
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
      try {
        const result = await analyzeImage(image.webPath);
        ingredients.value = result;
      } finally {
        isAnalyzing.value = false;
      }
    }
  } catch (e) {
    console.error('Camera cancelled or failed', e);
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

const findRecipes = () => {
  const navigate = (queryParams: any) => {
    router.push({
      path: '/recipes',
      query: queryParams
    });
  };

  const baseQuery: any = {
    ingredients: ingredients.value.join(',')
  };

  if (navigator.geolocation) {
    // Try to get location with a short timeout so we don't block the user too long
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        navigate({
          ...baseQuery,
          lat: latitude.toString(),
          lng: longitude.toString()
        });
      },
      (error) => {
        console.warn('Location access denied or failed, proceeding with ingredients only', error);
        navigate(baseQuery);
      },
      { timeout: 5000 }
    );
  } else {
    navigate(baseQuery);
  }
};
</script>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 2px dashed var(--ion-color-medium);
  border-radius: 10px;
  cursor: pointer;
}
.captured-image {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 10px;
}
.add-ingredient {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
</style>
