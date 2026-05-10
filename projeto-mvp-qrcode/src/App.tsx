/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { QRControls } from './components/qr/QRControls';
import { QRPreview } from './components/qr/QRPreview';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Library } from './components/qr/Library';
import { History } from './components/qr/History';
import { ProjectHub } from './components/qr/ProjectHub';
import { useQRCodeContext } from './contexts/QRCodeContext';
import { useAuth } from './contexts/AuthContext';
import { qrService } from './services/qrService';
import { localHistoryService } from './services/localHistoryService';
import { useState } from 'react';
import { LoginGate } from './components/auth/LoginGate';

export default function App() {
  const { ref, options, updateOptions, download, downloadJSON, onImageUpload } = useQRCodeContext();
  const { user, isAdmin } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = (extension?: any) => {
    download(extension);
    const fmt = extension || options.extension || 'png';
    const content = options.data || '';
    
    // Always log to local
    localHistoryService.addEntry(content, fmt);
    
    // Log to cloud if user is authenticated
    if (user) {
      qrService.logGeneration(user.uid, content, fmt);
    }
  };

  const handleDownloadJSON = () => {
    downloadJSON();
    const content = options.data || '';
    
    // Always log to local
    localHistoryService.addEntry(content, 'json');
    
    if (user) {
      qrService.logGeneration(user.uid, content, 'json');
    }
  };

  const handleSave = async (name: string) => {
    if (!user) return;
    try {
      setIsSaving(true);
      if (options.id) {
        await qrService.updateQRCode(options.id, name, options.data || '', options);
        updateOptions({ name });
        alert('Projeto atualizado com sucesso!');
      } else {
        const docRef = await qrService.saveQRCode(user.uid, name, options.data || '', options);
        updateOptions({ id: docRef.id, name });
        alert('Projeto salvo com sucesso!');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Erro ao salvar projeto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LoginGate>
      <Routes>
        <Route path="/" element={
           <MainLayout accentColor={options.dotsOptions?.color}>
             <ProjectHub />
           </MainLayout>
        } />

        <Route path="/editor" element={
        <MainLayout accentColor={options.dotsOptions?.color}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <QRControls 
                options={options} 
                updateOptions={updateOptions} 
                onImageUpload={onImageUpload} 
              />
            </div>
            <div className="lg:col-span-5">
              <QRPreview 
                qrRef={ref} 
                download={handleDownload} 
                downloadJSON={handleDownloadJSON}
                onSave={user ? handleSave : undefined}
                isSaving={isSaving}
              />
            </div>
          </div>
        </MainLayout>
      } />
      
      <Route path="/admin" element={
        isAdmin ? (
          <MainLayout accentColor="#f59e0b">
            <AdminDashboard />
          </MainLayout>
        ) : <Navigate to="/" />
      } />

      <Route path="/library" element={
        user ? (
          <MainLayout accentColor="#10b981">
            <Library />
          </MainLayout>
        ) : <Navigate to="/" />
      } />

      <Route path="/history" element={
        user ? (
          <MainLayout accentColor="#3b82f6">
            <History />
          </MainLayout>
        ) : <Navigate to="/" />
      } />
    </Routes>
    </LoginGate>
  );
}
