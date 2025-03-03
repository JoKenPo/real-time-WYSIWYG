import dynamic from 'next/dynamic';
import QuillCursors from 'quill-cursors';
import { useQuill } from 'react-quilljs';
import styles from './editor.module.scss';

import 'quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SocketIOClient } from '../../services/socket.services';
import { useRouter } from 'next/router';

interface IEditorProps {
	id: string;
	value?: string;
}

export default function Editor(props: IEditorProps) {
	const docId = props.id;
	const { data: session, status } = useSession();
	const router = useRouter();

	const toolbar = [
		[{ size: [] }],
		['bold', 'italic', 'underline', 'strike'],
		[{ color: [] }, { background: [] }],
		[{ script: 'super' }, { script: 'sub' }],
		[{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['direction', { align: [] }],
		['link', 'image', 'video', 'formula'],
		['clean'],
	];

	const theme = 'snow';

	const modules = {
		// cursor: true,
		toolbar,
	};

	const [editorValue, setEditorValue] = useState(props.value || '');

	const { quill, Quill, quillRef } = useQuill();
	// const { quillRef } = useQuill({ theme, modules });

	useEffect(() => {
		if (status === 'unauthenticated' || !session) {
			router.push('/');
		}
	}, [status, router]);

	const socketClient = new SocketIOClient({
		...session?.user,
	});

	useEffect(() => {
		console.log('Dados recebidos:', { conteudo: editorValue });
		socketClient.sendToRoom('edicao', docId, { conteudo: editorValue });
	}, [editorValue]);

	if (Quill && !quill) {
		// For execute this line only once.
		// Quill.register('modules/cursors', QuillCursors);
	}

	if (quill) {
		quill.on('text-change', (delta, oldDelta, source) => {
			socketClient.connectToRoom('edicao', docId);

			socketClient.onRoomEvent('edicao', docId, data => {
				console.log('Dados recebidos:', data);
			});

			// console.log('Text change!');
			// console.log(quill.getText()); // Get text only
			// console.log(quill.getContents()); // Get delta contents
			// console.log(quill.root.innerHTML); // Get innerHTML using quill
			// console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
			setEditorValue(quill.getText());
		});
	}

	// Quill.register('modules/cursors', QuillCursors);

	// const editor = new Quill(`#${props.id}`, {
	// 	modules: {
	// 		toolbar: toolbar,
	// 		theme: 'snow',
	// modules: {
	// 	cursors: true,
	// },
	// 	},
	// });

	return (
		<div className={styles.editor}>
			<div id={'toolbar'}></div>
			<p>{editorValue}</p>
			<div id={props.id} ref={quillRef}></div>
		</div>
	);
}
