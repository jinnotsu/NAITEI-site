"use client";
import { useSession } from "next-auth/react";
import { usePortfolioManager } from "@/hooks/usePortfolioManager";
import RequireLogin from "@/components/RequireLogin";
import ControlPanel from "@/components/ControlPanel";
import Preview from "@/components/Preview";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const { status } = useSession();
  const {
    inputs,
    setInputs,
    cssContents,
    isPreviewVisible,
    setIsPreviewVisible,
    selectedTemplate,
    setSelectedTemplate,
    imageUrl,
    handleSave,
    handleImageChange,
    handleImageDelete,
    handleChange,
    handleDownload,
  } = usePortfolioManager();

  if (status === "loading") {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <RequireLogin>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        <ControlPanel
          isPreviewVisible={isPreviewVisible}
          setIsPreviewVisible={setIsPreviewVisible}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          imageUrl={imageUrl}
          handleImageChange={handleImageChange}
          handleImageDelete={handleImageDelete}
          inputs={inputs}
          setInputs={setInputs}
          handleChange={handleChange}
          handleSave={handleSave}
          handleDownload={handleDownload}
        />
        <LogoutButton />
        {isPreviewVisible && (
          <Preview
            inputs={inputs}
            imageUrl={imageUrl}
            selectedTemplate={selectedTemplate}
            cssContents={cssContents}
          />
        )}
      </div>
    </RequireLogin>
  );
}