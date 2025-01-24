import { createContext } from 'react';
import { NT4_Client } from './nt4.ts';

export class Nt4Manager {
  private warned: boolean = false;
  private server: NT4_Client;

  constructor(team: number = 2713) {
    const teamSplit = [
      team.toString().substring(0, 2),
      team.toString().substring(2),
    ];
    this.server = new NT4_Client(
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : `10.${teamSplit[0]}.${teamSplit[1]}.2`,
      'scoreassist',
      () => {
      },
      () => {
      },
      () => {
      },
      () => {
        console.log('Connected to NT4 server', 'PoseRepublisher');
        this.warned = false;
        // TODO: Ensure temporarily losing network connection to the same server doesn't cause a crash
        this.server.publishNewTopic('/scoreassist/goto', 'string');
      },
      () => {
        if (!this.warned)
          console.error('Can\'t connect to NT', 'PoseRepublisher');
        this.warned = true;
      },
    );
    this.server.connect();
  }

  public publishNewGoTo(pose: string) {
    this.server.addSample('/scoreassist/goto', pose);
  }
}


export const NT4Context = createContext(new Nt4Manager());

