import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-habits-form',
  templateUrl: './habits-form.component.html',
  styleUrls: ['./habits-form.component.scss']
})
export class HabitsFormComponent implements OnInit {
  userName: string | null = null;
  dietOptions = ['Como carne todos los días', 'Como carne algunos días', 'No como carne', 'Soy vegano'];
  transportOptions = ['Bus', 'Carro o Taxi', 'Bicicleta', 'Voy caminando'];
  deviceOptions = ['Celular', 'Laptop', 'Tablet'];

  habits = {
    diet: '',
    transport: [],
    devices: []
  };

  currentStep = 1;  // Controla el paso actual (empieza en la primera pregunta)

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
      // this.userName = userDoc?.data()?.firstName || 'Usuario';
      this.userName = "hola"
    }
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

  // Guardar los hábitos en Firestore y continuar a la siguiente pregunta
  async saveAndContinue() {
    try {
      const userId = await this.authService.getUserId();
      if (userId) {
        await this.firestore.collection('habits').doc(userId).set({
          diet: this.habits.diet,
          transport: this.habits.transport,
          devices: this.habits.devices,
          date: this.getCurrentDate()  // Guardar la fecha en formato MM-DD-YYYY
        }, { merge: true });
        console.log('Hábitos guardados');
        this.currentStep++;  // Pasar a la siguiente pregunta
      }
    } catch (error) {
      console.error('Error al guardar hábitos:', error);
    }
  }

  // Guardar los hábitos y finalizar
  async saveAndFinish() {
    await this.saveAndContinue();
    // Aquí puedes redirigir a otra página o mostrar un mensaje de finalización
    console.log('Formulario completado');
  }

  // Obtener la fecha actual en formato MM-DD-YYYY
  getCurrentDate(): string {
    const date = new Date();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Asegura dos dígitos
    const day = ('0' + date.getDate()).slice(-2);           // Asegura dos dígitos
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
}
