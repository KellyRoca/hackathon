import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-habits-form',
  templateUrl: './habits-form.component.html',
  styleUrls: ['./habits-form.component.scss']
})
export class HabitsFormComponent implements OnInit {
  userName: string | null = null;
  dietOptions = ['Siempre consumo carne ♥️🍖', 'A veces consumo carne 🍖 ', 'Pocas veces como carne🙅🏼', 'Vegetariana🚫', 'Vegana♥️🐣'];
  transportOptions = ['🚌 Bus', '🚗 Carro o Taxi', '🚴‍♂️ Bicicleta', '🚶 Caminar'];
  deviceOptions = ['📱 Celular', '💻 Laptop', '📲 Tablet'];

  habits = {
    diet: '',
    transport: [],
    devices: []
  };

  currentStep = 1;

  constructor(private firestore: AngularFirestore, private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
      // this.userName = userDoc?.data()?.firstName || 'Usuario';
      this.userName = "hola"
    }
  }

  selectOption(category: string, option: string) {
    this.habits[category] = option;
  }

  toggleSelection(category: string, option: string) {
    const index = this.habits[category].indexOf(option);
    if (index > -1) {
      this.habits[category].splice(index, 1);
    } else {
      this.habits[category].push(option);
    }
  }

  async saveAndContinue() {
    try {
      const userId = await this.authService.getUserId();
      if (userId) {
        await this.firestore.collection('habits').doc(userId).set({
          diet: this.habits.diet,
          transport: this.habits.transport,
          devices: this.habits.devices,
          date: this.getCurrentDate()
        }, { merge: true });
        if(this.currentStep === 3){
          this.router.navigate(['inicio']);
        }else{
          this.currentStep++;
        }
      }
    } catch (error) {
      console.error('Error al guardar hábitos:', error);
    }
  }

  async saveAndFinish() {
    await this.saveAndContinue();
  }

  getCurrentDate(): string {
    const date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
