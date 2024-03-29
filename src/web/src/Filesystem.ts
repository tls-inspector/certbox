import { Rand } from './services/Rand';
import { ExportedFile } from './shared/types';

export class Filesystem {
    /**
     * Prompt the user to select a file and return the data of that file
     * @param accept A string matching the accept attribute of a file type <input>
     * @returns A promise that resolves with a byte array
     */
    public static ReadFile(accept: string): Promise<Uint8Array> {
        return new Promise(resolve => {
            const id = Rand.ID();
            const input = document.createElement('input');
            input.type = 'file';
            input.id = id;
            input.name = id;
            input.style.display = 'none';
            input.accept = accept;
            input.oninput = () => {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = (event: ProgressEvent<FileReader>) => {
                    resolve(new Uint8Array(event.target.result as ArrayBuffer));
                    input.remove();
                };
                reader.readAsArrayBuffer(file);
            };
            document.body.appendChild(input);
            input.click();
        });
    }

    /**
     * Prompt the user to save the given file
     * @param file The file to save
     */
    public static SaveFile(file: ExportedFile) {
        const id = Rand.ID();
        const a = document.createElement('a');
        a.id = id;
        a.style.display = 'none';
        a.href = 'data:' + file.Mime + ';base64,' + file.Data;
        a.download = file.Name;
        a.onclick = () => {
            a.remove();
        };
        document.body.appendChild(a);
        a.click();
    }
}
