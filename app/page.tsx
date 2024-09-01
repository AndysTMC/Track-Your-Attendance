"use client";
import Image from "next/image";
import { Provider } from 'react-redux';
import { store } from '@/app/redux/store';
import App from "./ui/App";


export default function Page() {
  return (
    <Provider store={store}>
      <main className="w-screen h-screen">
        <App />
      </main>
    </Provider>
  );
}
