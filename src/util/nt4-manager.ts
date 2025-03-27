import { createContext } from 'react';
import { NT4_Client } from './nt4.ts';

// Define a type for connection state change listeners
type ConnectionListener = (connected: boolean) => void;

export class Nt4Manager {
  private warned: boolean = false;
  private server: NT4_Client;
  private _connected: boolean = false;
  private _address: string = 'localhost';
  private connectionListeners: ConnectionListener[] = [];

  // Getter for the connected property
  get connected(): boolean {
    return this._connected;
  }

  get address(): string {
    return this._address;
  }

  // Method to subscribe to connection changes
  public onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.connectionListeners = this.connectionListeners.filter(
        (l) => l !== listener
      );
    };
  }

  // Private method to update connection state and notify listeners
  private setConnected(value: boolean): void {
    if (this._connected !== value) {
      this._connected = value;
      // Notify all listeners when the state changes
      this.connectionListeners.forEach((listener) => listener(value));
    }
  }

  constructor(team: number = 2713) {
    const teamSplit = [
      team.toString().substring(0, 2),
      team.toString().substring(2),
    ];

    this._address =
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : `10.${teamSplit[0]}.${teamSplit[1]}.2`;

    this.server = new NT4_Client(
      this._address,
      'scoreassist',
      () => {},
      () => {},
      () => {},
      () => {
        // console.log('Connected to NT4 server');
        this.warned = false;
        // TODO: Ensure temporarily losing network connection to the same server doesn't cause a crash
        this.server.publishNewTopic('/scoreassist/goto', 'string');
        this.server.publishNewTopic('/scoreassist/climbPrep', "boolean");
        this.setConnected(true);
      },
      () => {
        // Connection error handler
        this.warned = true;
        this.setConnected(false);
      }
    );
    this.server.connect();
  }

  public publishNewGoTo(pose: string) {
    this.server.addSample('/scoreassist/goto', pose);
  }

  public publishClimbPrep(climbPrep: boolean) {
    this.server.addSample('/scoreassist/climbPrep', climbPrep);
  }
}

// Create a singleton instance to be used throughout the app
const nt4ManagerInstance = new Nt4Manager();

export const NT4Context = createContext(nt4ManagerInstance);
