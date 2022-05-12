import React, { useState } from "react";
import { Form, Input } from "antd";

export default function NameForm() {
  const [userName, setUserName] = useState();
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    localStorage.setItem("username", userName);
    localStorage.setItem("name", name);
    if (imageUrl) localStorage.setItem("image", imageUrl);
    window.location.reload();
  };

  const generateImageURL = () => {
    const randomNumber = Math.floor(Math.random() * 100);
    const image = `https://avatars.dicebear.com/api/pixel-art-neutral/${randomNumber}.svg`;
    setImageUrl(image);
    form.setFieldsValue({
      image_url: image,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between bg-gradient-to-br from-slate-900 to-emerald-600">
      <div className="flex w-full max-w-xl flex-1 items-center px-2">
        <div className="mt-2 h-full w-full bg-white px-4 py-4 shadow-xl md:max-w-xl md:rounded-md">
          <h3 className="text-center text-3xl font-semibold text-zinc-800">
            Welcome To Chat App!
          </h3>
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username!",
                },
              ]}
            >
              <Input
                className="rounded-md"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name!",
                },
              ]}
            >
              <Input
                className="rounded-md"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="image_url" label="Image URL">
              <div className="relative">
                <Input
                  className="rounded-md"
                  onChange={(e) => setImageUrl(e.target.value)}
                  value={imageUrl}
                />
                <button
                  className="absolute right-1 top-[3px] rounded-full bg-gray-800/30 py-0.5 px-2 text-white hover:bg-gray-800"
                  type="button"
                  onClick={generateImageURL}
                >
                  Generate Random
                </button>
              </div>
            </Form.Item>
            <Form.Item className="m-0">
              <div className="text-center">
                <button
                  type="submit"
                  className="mt-2 h-12 w-4/5 rounded-full bg-gray-700 text-white shadow-md shadow-gray-700 transition duration-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white"
                >
                  Submit
                </button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="h-full w-full bg-slate-800 p-2">
        <div className="space-y-0.5 py-0.5 text-center">
          <h3 className="text-base font-semibold text-white">
            &copy; 2021 Created by Javaughn Pryce
          </h3>
        </div>
      </div>
    </div>
  );
}
