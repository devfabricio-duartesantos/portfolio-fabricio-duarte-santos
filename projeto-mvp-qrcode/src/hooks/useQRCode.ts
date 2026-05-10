import { useEffect, useRef, useState, ChangeEvent } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRState, INITIAL_STATE, Extension } from '../types/qr';

export const useQRCode = () => {
  const [options, setOptions] = useState<QRState>(INITIAL_STATE);
  const [qrCode] = useState<QRCodeStyling>(new QRCodeStyling(INITIAL_STATE));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      qrCode.append(ref.current);
    }
  }, [qrCode, ref]);

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

    setOptions((prev) => {
      const merged = deepMerge(prev, newOptions);
      // We pass the delta to the library for better performance and reliability
      qrCode.update(newOptions);
      return merged;
    });
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

  return {
    ref,
    options,
    updateOptions,
    download,
    downloadJSON,
    onImageUpload
  };
};
