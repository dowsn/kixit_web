import fs from 'fs';
import path from 'path';

export function deleteFolderContents(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (let file of files) {
            let filePath = path.join(directory, file);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    deleteFolderContents(filePath);
                } else {
                    fs.unlink(filePath, err => {
                        if (err) throw err;
                    });
                }
            });
        }
    });
}

