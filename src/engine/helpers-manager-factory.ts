import {CondenseSchedulesHelper} from './condense-schedules-helper';
import {HelpersManager} from './helper';

export function CreateHelpersManager() {
  return new HelpersManager(new CondenseSchedulesHelper());
}
