import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ModeToggle } from "../modeToggle";

export function Component() {
  const [images, setImages] = useState<string[]>([]);
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  interface AnnotationPayload {
    displayName: string;
    classification?: {
      score: number;
    };
  }
  const AccessToken = import.meta.env.VITE_AccessToken;
  const projectId = import.meta.env.VITE_projectId;
  const modelId = import.meta.env.VITE_modelId;
  console.log(AccessToken, projectId, modelId);
  console.log(images);
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormDetails({
      ...formDetails,
      [event.target.id]: event.target.value,
    });
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const image of images) {
      const base64Image = image.split(",")[1];

      // Construct request body
      const requestBody = {
        instances: [
          {
            content: base64Image,
          },
        ],
        parameters: {
          confidenceThreshold: 0.5,
          maxPredictions: 5,
        },
      };
      console.log(requestBody);

      try {
        if (!projectId) {
          throw new Error("Project ID is not defined");
        }
        const response = await fetch(
          `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/endpoints/${modelId}:predict`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${AccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        console.log(responseData);
        responseData.payload?.forEach(
          (annotationPayload: AnnotationPayload) => {
            console.log(
              `Predicted class name: ${annotationPayload.displayName}`
            );
            console.log(
              `Predicted class score: ${annotationPayload.classification?.score}`
            );
          }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
  // Set your project ID, location, and model ID
  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (event.target.files) {
        const files = Array.from(event.target.files);
        Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        )
          .then((base64Strings: string[]) => {
            setImages(base64Strings);
          })
          .catch((error) => console.error(error));
      }
    } catch (error) {
      console.error(error);
    }
  }
  function handleRemoveImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  return (
    <main className="flex flex-col items-center justify-center h-full py-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-row justify-between items-center max-w-2xl py-2 mx-4 space-x-9">
        <div>
          <a className="text-xl font-bold">Home</a>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>

      <div className="w-full max-w-md p-6 m-auto bg-white rounded-xl shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Data Upload and Prediction
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Please fill out the form below and upload your image for prediction.
        </p>
        <form className="grid gap-6 mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              type="text"
              value={formDetails.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={formDetails.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label className="text-left" htmlFor="phone">
              Phone Number
            </Label>
            <PhoneInput
              id="phoneNumber"
              placeholder="Enter your phone number"
              value={formDetails.phoneNumber}
              onChange={(value) =>
                setFormDetails({ ...formDetails, phoneNumber: value || "" })
              }
              inputComponent={Input}
              className=" text-gray-600 dark:bg-gray-800 "
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-left" htmlFor="image">
              Upload Images
            </Label>
            <Input
              accept=".jpg, .jpeg, .png"
              id="image"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please upload .jpg or .png images. Maximum file size is 5MB per
              image.
            </p>
          </div>
          <Button className="w-full" type="submit">
            Get Estimation
          </Button>
        </form>
      </div>
      <hr />
      {images.length > 0 ? (
        <h1 className="text-xl my-4">Added Images</h1>
      ) : (
        <h1 className="text-xl my-4">Please add images</h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-3 my-4">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={image}
              alt={`Uploaded ${index}`}
              className="w-full h-auto mb-2"
            />
            <Button className="p-4" onClick={() => handleRemoveImage(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </main>
  );
}
