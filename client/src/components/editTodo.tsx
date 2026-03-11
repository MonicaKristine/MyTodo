import { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Form, Button, Modal } from "react-bootstrap";
import { getStatuses, editTodo } from "../api/todos";
import { getCategories } from "../api/categories";

type Status = { id: number; status: string };
type Category = { id: number; name: string };

export type EditTodoType = {
  id: number;
  name: string;
  description: string;
  status: string;
  category: string;
};

type Props = {
  show: boolean;
  todo: EditTodoType;
  onClose: () => void;
  onSaved: () => void;
};

function EditTodoModal({ show, todo, onClose, onSaved }: Props) {
  const [name, setName] = useState(todo.name);
  const [description, setDescription] = useState(todo.description);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatuses().then((data: Status[]) => {
      setStatuses(data);
      const found = data.find((s) => s.status === todo.status);
      if (found) setSelectedStatus(found);
    });

    getCategories().then((data: Category[]) => {
      setCategories(data);
      const found = data.find((c) => c.name === todo.category);
      if (found) setSelectedCategory(found);
    });
  }, [todo]);

  const handleSubmit = async () => {
    if (!name || !description || !selectedStatus || !selectedCategory) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await editTodo(
        todo.id,
        name,
        description,
        selectedStatus.id,
        selectedCategory.id,
      );
      onSaved();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <p>{error}</p>}

          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <DropdownButton
              variant="secondary"
              title={selectedStatus?.status || "Status"}
              id="status-dropdown"
              align="end"
            >
              {statuses.map((status) => (
                <Dropdown.Item
                  key={status.id}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.status}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>

          <Form.Group>
            <Form.Label>Category</Form.Label>
            <DropdownButton
              variant="secondary"
              title={selectedCategory?.name || "Category"}
              id="category-dropdown"
              align="end"
            >
              {categories.map((category) => (
                <Dropdown.Item
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="pink-black-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="pink-black-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditTodoModal;
