import { useForm } from 'react-hook-form';
import { User } from '../models/user';
import { SignupCredentials } from '../network/note_api';
import * as NotesApi from '../network/note_api';
import { Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import styleUtils from '../styles/utils.module.css';

interface SignUpModuleProps {
  onDissmis: () => void;
  onSignUpSuccessful: (user: User) => void;
}

const SignUpModal = ({ onDissmis, onSignUpSuccessful }: SignUpModuleProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupCredentials>();

  async function onSubmit(credentials: SignupCredentials) {
    try {
      const newUser = await NotesApi.signUp(credentials);
      onSignUpSuccessful(newUser);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDissmis}>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Username"
            type="text"
            placeholder="username"
            register={register}
            registerOptions={{ required: 'Required' }}
            error={errors.username}
          />

          <TextInputField
            name="email"
            label="Email"
            type="email"
            placeholder="email"
            register={register}
            registerOptions={{ required: 'Required' }}
            error={errors.email}
          />

          <TextInputField
            name="password"
            label="Password"
            type="password"
            placeholder="password"
            register={register}
            registerOptions={{ required: 'Required' }}
            error={errors.password}
          />
          <Button type="submit" disabled={isSubmitting} className={styleUtils.width100}>
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
