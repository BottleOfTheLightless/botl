import { Subject } from 'rxjs';
import { Command } from '../interfaces';

export const CommandInput = new Subject<Command>();
