import { Launcher } from 'chrome-launcher';

Launcher.prototype.destroyTmp = function destroyTmp() {
  if (this.outFile) {
    this.fs.closeSync(this.outFile);
    delete this.outFile;
  }
  if (this.errFile) {
    this.fs.closeSync(this.errFile);
    delete this.errFile;
  }
};
