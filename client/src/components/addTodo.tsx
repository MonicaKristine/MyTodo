import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { getStatuses, addTodo } from "../api/todos";
import { getCategories } from "../api/categories";

type Status = { id: number; status: string };
type Category = { id: number; name: string };

function AddTodo() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatuses().then(setStatuses).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!name || !description || !selectedStatus || !selectedCategory) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await addTodo(name, description, selectedStatus.id, selectedCategory.id);
      setName("");
      setDescription("");
      setSelectedStatus(null);
      setSelectedCategory(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <p>{error}</p>}
      <InputGroup className="add-todo mb-3">
        <Form.Control
          placeholder="New Todo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Form.Control
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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

        <Button
          className="pink-black-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          Add
        </Button>
      </InputGroup>
    </>
  );
}

export default AddTodo;
