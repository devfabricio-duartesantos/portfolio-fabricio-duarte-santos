import React, { createContext, useContext, useEffect, useRef, useState, ChangeEvent } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRState, INITIAL_STATE, Extension } from '../types/qr';

interface QRCodeContextType {
  ref: (node: HTMLDivElement | null) => void;
  options: QRState;
  updateOptions: (newOptions: Partial<QRState>) => void;
  loadOptions: (loadedOptions: QRState) => void;
  resetOptions: () => void;
  download: (extension?: Extension) => void;
  downloadJSON: () => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const QRCodeContext = createContext<QRCodeContextType | undefined>(undefined);

export const QRCodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<QRState>(INITIAL_STATE);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(INITIAL_STATE));
  const qrRef = useRef<HTMLDivElement | null>(null);

  // Callback ref to handle mounting/unmounting and switching modes
  const setRef = (node: HTMLDivElement | null) => {
    if (node) {
      qrRef.current = node;
      qrCode.append(node);
    }
  };

  // Real-time synchronization: Update the QR code whenever options change
  useEffect(() => {
    qrCode.update(options);
  }, [options, qrCode]);

  const updateOptions = (newOptions: Partial<QRState>) => {
    const deepMerge = (target: any, source: any) => {
      const output = { ...target };
      if (typeof target === 'object' && target !== null && typeof source === 'object' && source !== null) {
        Object.keys(source).forEach(key => {
          if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            if (!(key in target)) {
              Object.assign(output, { [key]: source[key] });
            } else {
              output[key] = deepMerge(target[key], source[key]);
            }
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
      return output;
    };

    setOptions((prev) => deepMerge(prev, newOptions));
  };

  const loadOptions = (loadedOptions: QRState) => {
    setOptions(loadedOptions);
    qrCode.update(loadedOptions);
  };

  const resetOptions = () => {
    setOptions(INITIAL_STATE);
    qrCode.update(INITIAL_STATE);
  };

  const download = (extension?: Extension) => {
    qrCode.download({ extension: extension || options.extension });
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "qr-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const onImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateOptions({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <QRCodeContext.Provider value={{
      ref: setRef,
      options,
      updateOptions,
      loadOptions,
      resetOptions,
      download,
      downloadJSON,
      onImageUpload
    }}>
      {children}
    </QRCodeContext.Provider>
  );
};

export const useQRCodeContext = () => {
  const context = useContext(QRCodeContext);
  if (context === undefined) {
    throw new Error('useQRCodeContext must be used within a QRCodeProvider');
  }
  return context;
};
