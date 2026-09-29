import { useState } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActivityLayout, GoHome, WinBanner, useStoryParam } from '../../components/ActivityLayout';
import type { Story } from '../../data/stories';
import { paths } from '../../paths';

export function OrderGame() {
  const story = useStoryParam();
  return story ? <OrderBoard key={story.id} story={story} /> : <GoHome />;
}

interface Item {
  id: string;
  text: string;
  /** Posición correcta en el cuento. */
  index: number;
}

function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function OrderBoard({ story }: { story: Story }) {
  const [items, setItems] = useState<Item[]>(() => shuffle(story.order.map((text, index) => ({ id: String(index), text, index }))));
  const [checked, setChecked] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const won = checked && items.every((item, i) => item.index === i);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setChecked(false);
    setItems((list) => arrayMove(list, list.findIndex((i) => i.id === active.id), list.findIndex((i) => i.id === over.id)));
  };

  return (
    <ActivityLayout
      variant="order"
      titleImage="/assets/juegos/ui/titulo-ordenar.webp"
      titleAlt="Cuenta cuentos"
      instructions="Arrastra las partes del cuento para ponerlas en orden, desde el inicio hasta el final."
      back={{ to: paths.story(story.id), label: 'Atrás' }}
      next={paths.differences(story.id)}
      won={won}
    >
      <div className="wood-board">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ol className="order-list">
              {items.map((item, i) => (
                <OrderItem key={item.id} item={item} position={i} result={checked ? item.index === i : undefined} />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
        {won && <WinBanner next={paths.differences(story.id)} />}
      </div>
      <div className="game-footer">
        {/* La key cambia en cada intento para repetir la animación de "no todavía". */}
        <button
          key={attempt}
          type="button"
          className={`check-button${checked && !won ? ' anim-wiggle-once' : ''}`}
          onClick={() => {
            setChecked(true);
            setAttempt((n) => n + 1);
          }}
        >
          <img src="/assets/juegos/ui/boton-revisar.webp" alt="Revisar resultado" width={500} height={313} />
        </button>
      </div>
    </ActivityLayout>
  );
}

function OrderItem({ item, position, result }: { item: Item; position: number; result?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const state = result === undefined ? '' : result ? ' is-correct' : ' is-wrong';
  return (
    <li
      ref={setNodeRef}
      className={`order-item${state}${isDragging ? ' is-dragging' : ''}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
    >
      <span className="order-number">{position + 1}</span>
      <span className="order-text">{item.text}</span>
      <span className="order-handle" aria-hidden>
        ☰
      </span>
    </li>
  );
}
