import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  userName: string | null = null;
  habits: any = {};
  selectedTimeRange: string | null = null;
  showCarneQuestion = false;
  meatConsumption = '';
  transportTimes: any = {};
  deviceTimes: any = {};
  timeRanges = ['7 a 11 am', '11am a 3pm', '3pm a 7pm', '7pm a 11pm', 'Todo el día'];
  carneOptions = ['Sí', 'No'];

  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  async ngOnInit() {
    const userId = await this.authService.getUserId();
    if (userId) {
      this.userName = await this.authService.getUserName();

      // Obtener hábitos del usuario
      this.firestore.collection('habits').doc(userId).valueChanges().subscribe((habits: any) => {
        this.habits = habits;

        // Inicializar los tiempos de transporte y dispositivos en 0
        this.habits.transport.forEach((transport: string) => {
          this.transportTimes[transport] = 0;
        });

        this.habits.devices.forEach((device: string) => {
          this.deviceTimes[device] = 0;
        });
      });
    }
  }

  selectTimeRange(range: string) {
    this.selectedTimeRange = range;
    if (this.habits.diet !== 'vegano' && this.habits.diet !== 'no_carne') {
      this.showCarneQuestion = true;
    }
  }

  selectOption(category: string, option: string) {
    this[category] = option;
  }

  getTransportImage(transport: string): string {
    const images = {
      'Bus': 'assets/images/bus.png',
      'Carro o Taxi': 'assets/images/car.png',
      'Bicicleta': 'assets/images/bicycle.png',
      'Voy caminando': 'assets/images/walk.png'
    };
    return images[transport] || 'assets/images/default.png';
  }

  getDeviceImage(device: string): string {
    const images = {
      'Celular': 'assets/images/phone.png',
      'Laptop': 'assets/images/laptop.png',
      'Tablet': 'assets/images/tablet.png'
    };
    return images[device] || 'assets/images/default.png';
  }

  async saveDailyHabits() {
    try {
      const userId = await this.authService.getUserId();
      if (userId && this.selectedTimeRange) {
        await this.firestore.collection('daily_habits').doc(userId).collection(this.selectedTimeRange).add({
          meatConsumption: this.meatConsumption,
          transportTimes: this.transportTimes,
          deviceTimes: this.deviceTimes,
          timestamp: new Date()
        });
        console.log('Hábitos diarios guardados');
      }
    } catch (error) {
      console.error('Error al guardar hábitos diarios:', error);
    }
  }
}
