// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// Function to create the folder and files
function createFolderAndFiles(parentFolderPath, folderName) {
  const folderPath = path.join(parentFolderPath, folderName);
  fs.mkdirSync(folderPath);

  const files = [
    `${folderName}.constants.ts`,
    `${folderName}.controller.ts`,
    `${folderName}.interface.ts`,
    `${folderName}.models.ts`,
    `${folderName}.route.ts`,
    `${folderName}.service.ts`,
    `${folderName}.utils.ts`,
    `${folderName}.validation.ts`,
  ];

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    let content = '';

    if (file === `${folderName}.service.ts`) {
      content = `const create${folderName} = async () => {};
const getAll${folderName} = async () => {};
const get${folderName}ById = async () => {};
const update${folderName} = async () => {};
const delete${folderName} = async () => {};

export const ${folderName}Service = {
  create${folderName},
  getAll${folderName},
  get${folderName}ById,
  update${folderName},
  delete${folderName},
};`;
    } else if (file === `${folderName}.controller.ts`) {
      content = `import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const create${folderName} = catchAsync(async (req: Request, res: Response) => {});
const getAll${folderName} = catchAsync(async (req: Request, res: Response) => {});
const get${folderName}ById = catchAsync(async (req: Request, res: Response) => {});
const update${folderName} = catchAsync(async (req: Request, res: Response) => {});
const delete${folderName} = catchAsync(async (req: Request, res: Response) => {});

export const ${folderName}Controller = {
  create${folderName},
  getAll${folderName},
  get${folderName}ById,
  update${folderName},
  delete${folderName},
};`;
    } else if (file === `${folderName}.route.ts`) {
      content = `import { Router } from 'express';
import { ${folderName}Controller } from './${folderName}.controller';

const router = Router();

router.post('/create-${folderName}', ${folderName}Controller.create${folderName});

router.patch('/update/:id', ${folderName}Controller.update${folderName});

router.delete('/:id', ${folderName}Controller.delete${folderName});

router.get('/:id', ${folderName}Controller.get${folderName});
router.get('/', ${folderName}Controller.get${folderName});

export const ${folderName}Routes = router;`;
    }

    fs.writeFileSync(filePath, content, 'utf8');
  });

  console.log(`Folder "${folderName}" and files created successfully.`);
}

// Prompting the user for the parent folder path and folder name
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter parent folder path: ', parentFolderPath => {
  readline.question('Enter folder name: ', folderName => {
    createFolderAndFiles(parentFolderPath, folderName);
    readline.close();
  });
});
