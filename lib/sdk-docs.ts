import {
    SiJavascript, SiDart, SiPython, SiSwift, SiKotlin
} from 'react-icons/si';
import { Terminal } from 'lucide-react';

export interface SdkMethod {
    id: string;
    name: string;
    description: string;
    parameters?: { name: string; type: string; description: string }[];
    example: string;
}

export interface SdkSection {
    id: string;
    title: string;
    methods: SdkMethod[];
}

export interface SdkDocData {
    id: string;
    name: string;
    lang: string;
    icon: any;
    color: string;
    intro: string;
    install: string;
    sections: SdkSection[];
}

export const SDK_DOCS: Record<string, SdkDocData> = {
    'afribase-js': {
        id: 'afribase-js',
        name: 'afribase-js',
        lang: 'JavaScript / TypeScript',
        icon: SiJavascript,
        color: 'yellow-400',
        intro: 'Full-featured client for Web and Node.js. Supports the new Functional-Fluent API.',
        install: 'npm install @afribase/js',
        sections: [
            {
                id: 'init',
                title: 'Getting Started',
                methods: [
                    {
                        id: 'create-client',
                        name: 'createClient()',
                        description: 'Initialize a new Afribase client.',
                        parameters: [
                            { name: 'url', type: 'string', description: 'The Afribase project URL.' },
                            { name: 'key', type: 'string', description: 'The project anon key.' }
                        ],
                        example: `import { createClient } from '@afribase/js'\n\nconst afribase = createClient(\n  'https://your-project.afribase.io',\n  'your-anon-key'\n)`
                    }
                ]
            },
            {
                id: 'db',
                title: 'Database (The Afribase Way)',
                methods: [
                    {
                        id: 'db-select',
                        name: 'db(from(), select())',
                        description: 'The Functional-Fluent way to fetch data. Tree-shakable and modular.',
                        example: `import { db, from, select, eq, limit } from '@afribase/js'\n\nconst { data, error } = await db(\n  afribase.from('posts'),\n  select('*'),\n  eq('status', 'published'),\n  limit(10)\n)`
                    },
                    {
                        id: 'insert',
                        name: 'insert()',
                        description: 'Insert new rows into a table.',
                        example: `const { data, error } = await afribase\n  .from('posts')\n  .insert({ title: 'Hello World', content: '...' })`
                    }
                ]
            },
            {
                id: 'auth',
                title: 'Authentication',
                methods: [
                    {
                        id: 'signup',
                        name: 'signUp()',
                        description: 'Register a new user.',
                        example: `const { data, error } = await afribase.auth.signUp({\n  email: 'example@email.com',\n  password: 'password'\n})`
                    },
                    {
                        id: 'signin',
                        name: 'signInWithPassword()',
                        description: 'Log in an existing user.',
                        example: `const { data, error } = await afribase.auth.signInWithPassword({\n  email: 'example@email.com',\n  password: 'password'\n})`
                    }
                ]
            }
        ]
    },
    'afribase_flutter': {
        id: 'afribase_flutter',
        name: 'afribase_flutter',
        lang: 'Dart / Flutter',
        icon: SiDart,
        color: 'sky-400',
        intro: 'Unified client for Android, iOS, and Web. Optimized for cross-platform pipelines.',
        install: 'flutter pub add afribase',
        sections: [
            {
                id: 'init',
                title: 'Initialization',
                methods: [
                    {
                        id: 'init-client',
                        name: 'AfribaseClient()',
                        description: 'Initialize the Afribase client in Flutter.',
                        example: `final afribase = AfribaseClient(\n  'https://your-project.afribase.io',\n  'your-anon-key',\n);`
                    }
                ]
            },
            {
                id: 'db',
                title: 'Database (Piped Queries)',
                methods: [
                    {
                        id: 'db-piped',
                        name: 'db()',
                        description: 'Unified piping pattern for Flutter developers.',
                        example: `final res = await afribase.db('posts', [\n  select('*'),\n  eq('category', 'tech'),\n  limit(5),\n]);`
                    }
                ]
            }
        ]
    },
    'afribase-py': {
        id: 'afribase-py',
        name: 'afribase-py',
        lang: 'Python',
        icon: SiPython,
        color: 'blue-500',
        intro: 'Native Python client for server-side logic and AI orchestrations.',
        install: 'pip install afribase',
        sections: [
            {
                id: 'init',
                title: 'Basics',
                methods: [
                    {
                        id: 'create-client',
                        name: 'create_client()',
                        description: 'Initialize the Python client.',
                        example: `from afribase import create_client\n\nafribase = create_client(\n  "https://your-project.afribase.io",\n  "your-anon-key"\n)`
                    }
                ]
            },
            {
                id: 'db',
                title: 'Modular Queries',
                methods: [
                    {
                        id: 'db-op',
                        name: 'db()',
                        description: 'The Afribase Way for Python.',
                        example: `from afribase import db, select, eq\n\nres = db(afribase.from_("posts"),\n  select("*"),\n  eq("author", "ryuzaki")\n)`
                    }
                ]
            }
        ]
    }
};
