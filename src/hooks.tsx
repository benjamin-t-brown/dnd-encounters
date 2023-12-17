import Modal from 'elements/Modal';
import { ModalProps } from 'elements/Modal';
import React, {
  KeyboardEventHandler,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { DataContext } from 'App';
import { getKey } from 'data/storage';

export const useReRender = () => {
  const [, updateState] = useState();
  const handleForceUpdateMethod = useCallback(() => updateState({} as any), []);
  return handleForceUpdateMethod;
};

export const useModal = (modalProps: Partial<ModalProps>) => {
  const [open, setOpen] = useState(false);

  useKeyboardEventListener(
    ev => {
      if (open) {
        if (ev.key === 'Enter') {
          if (modalProps.disableEnterConfirm) {
            return;
          }

          const shouldClose = modalProps.onConfirm?.();
          if (shouldClose === true || shouldClose === undefined) {
            setOpen(false);
          }
        }
        if (ev.key === 'Escape') {
          setOpen(false);
          modalProps.onCancel?.();
        }
      }
    },
    [open, modalProps]
  );

  return {
    open,
    setOpen,
    modal: open ? (
      <Modal
        {...modalProps}
        open={open}
        onConfirm={() => {
          const shouldClose = modalProps.onConfirm?.();
          if (shouldClose === true || shouldClose === undefined) {
            setOpen(false);
          }
        }}
        onCancel={
          modalProps.onCancel
            ? () => {
                setOpen(false);
                modalProps.onCancel?.();
              }
            : undefined
        }
      />
    ) : null,
  };
};

interface FormProps<T> {
  formId: string;
  initialValues: T;
}
interface FormAction {
  type: 'change' | 'reset';
  payload?: any;
}
const forms: Record<string, any> = {};
export function getFormValues<T>(id: string) {
  return forms[id] as T | undefined;
}
export function useForm<T>(formProps: FormProps<T>) {
  useEffect(() => {
    forms[formProps.formId] = formProps.initialValues;
  }, []);

  const [formState, dispatch] = useReducer((state: T, action: FormAction) => {
    const newState = {
      ...state,
    };
    switch (action.type) {
      case 'change': {
        if (action.payload) {
          newState[action.payload.key] = action.payload.value;
        }
        break;
      }
      case 'reset': {
        const newState = action.payload ?? formProps.initialValues;
        forms[formProps.formId] = newState;
        return newState;
      }
    }
    forms[formProps.formId] = newState;
    return newState;
  }, formProps.initialValues);

  return {
    formState: formState as T,
    dispatch,
    change: (key: keyof T, value: string | number | boolean) => {
      dispatch({
        type: 'change',
        payload: {
          key: key as string,
          value,
        },
      });
    },
    reset: (values?: T) => {
      dispatch({
        type: 'reset',
        payload: values,
      });
    },
  };
}

export const useDatabase = () => {
  return useContext(DataContext);
};

export const usePageReRender = () => {
  return (window as any).reRender;
};

export type RouteString =
  | 'unit-list'
  | 'party-list'
  | 'encounter-list'
  | 'error'
  | string
  | null;

export const useLSRoute = (): RouteString => {
  return localStorage.getItem(getKey('route')) as RouteString;
};
export const setLSRoute = (route: RouteString) => {
  localStorage.setItem(getKey('route'), route as string);
  const history = getLSRouteHistory();
  history.push(route);
  setLSRouteHistory(history);
  (window as any).reRender();
};
export const setLSRouteBack = () => {
  const history = getLSRouteHistory();
  history.pop();
  const route = history.pop() ?? 'encounter-list';
  setLSRouteHistory(history);
  setLSRoute(route);
};
export const getLSRouteHistory = () => {
  const history = localStorage.getItem(getKey('route-history'));
  try {
    return JSON.parse(history ?? '[]') as RouteString[];
  } catch (e) {
    console.error('Failed to parse LSRoute History', history);
    return [];
  }
};
export const setLSRouteHistory = (routes: RouteString[]) => {
  localStorage.setItem(getKey('route-history'), JSON.stringify(routes));
};

export const useGlobalAlert = () => {
  return (msg: string) => {
    (window as any).showInfoModal(msg);
  };
};

export const useGlobalConfirm = () => {
  return (msg: string, cb: () => void) => {
    (window as any).showConfirmModal(msg, cb);
  };
};

export const useKeyboardEventListener = (
  cb: KeyboardEventHandler,
  captures?: any[]
) => {
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (!ev.repeat) {
        cb(ev as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, captures);
};
