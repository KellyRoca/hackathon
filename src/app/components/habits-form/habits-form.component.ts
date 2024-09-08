import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-habits-form',
  templateUrl: './habits-form.component.html',
  styleUrls: ['./habits-form.component.scss'] // Puedes agregar estilos para los botones
})
export class HabitsFormComponent {
  step = 1;
  dietOptions = ['Como carne todos los días', 'Como carne algunos días', 'No como carne', 'Soy vegano'];
  transportOptions = ['Bus', 'Carro o Taxi', 'Bicicleta', 'Voy caminando'];
  deviceOptions = ['Celular', 'Laptop', 'Tablet'];

  habits = {
    diet: '',
    transport: [],
    devices: []
  };

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  nextStep() {
    this.step++;
  }

  // Selecciona solo una opción (para la dieta)
  selectOption(category: string, option: string) {
    this.habits[category] = option;
  }

  // Permite selección múltiple (para transporte y dispositivos)
  toggleSelection(category: string, option: string) {
    const index = this.habits[category].indexOf(option);
    if (index > -1) {
      this.habits[category].splice(index, 1); // Deseleccionar
    } else {
      this.habits[category].push(option); // Seleccionar
    }
  }

  async saveHabits() {
    try {
      const userId = await this.authService.getUserId();
      if (userId) {
        await this.firestore.collection('habits').doc(userId).set({
          diet: this.habits.diet,
          transport: this.habits.transport,
          devices: this.habits.devices,
          timestamp: new Date()
        });
        console.log('Hábitos guardados');
      }
    } catch (error) {
      console.error('Error al guardar hábitos:', error);
    }
  }
}
